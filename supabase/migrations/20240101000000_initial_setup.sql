-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create profiles table
create table public.profiles (
    id uuid references auth.users on delete cascade not null primary key,
    email text unique not null,
    full_name text,
    avatar_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create a secure RLS policy
alter table public.profiles enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone."
    on profiles for select
    using ( true );

create policy "Users can insert their own profile."
    on profiles for insert
    with check ( auth.uid() = id );

create policy "Users can update their own profile."
    on profiles for update
    using ( auth.uid() = id );

-- Create function to handle user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.profiles (id, email, full_name, avatar_url)
    values (
        new.id,
        new.email,
        new.raw_user_meta_data->>'full_name',
        new.raw_user_meta_data->>'avatar_url'
    );
    return new;
end;
$$ language plpgsql security definer;

-- Create trigger for new user creation
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();

-- Create function to handle user updates
create or replace function public.handle_updated_user()
returns trigger as $$
begin
    update public.profiles
    set
        email = new.email,
        full_name = coalesce(new.raw_user_meta_data->>'full_name', full_name),
        avatar_url = coalesce(new.raw_user_meta_data->>'avatar_url', avatar_url),
        updated_at = now()
    where id = new.id;
    return new;
end;
$$ language plpgsql security definer;

-- Create trigger for user updates
create trigger on_auth_user_updated
    after update on auth.users
    for each row execute procedure public.handle_updated_user();

-- Create function to handle user deletion
create or replace function public.handle_deleted_user()
returns trigger as $$
begin
    delete from public.profiles where id = old.id;
    return old;
end;
$$ language plpgsql security definer;

-- Create trigger for user deletion
create trigger on_auth_user_deleted
    before delete on auth.users
    for each row execute procedure public.handle_deleted_user();

-- Create a table for user settings
create table public.user_settings (
    id uuid references auth.users on delete cascade not null primary key,
    theme text default 'light'::text,
    notifications_enabled boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for user_settings
alter table public.user_settings enable row level security;

-- Create policies for user_settings
create policy "Users can view their own settings."
    on user_settings for select
    using ( auth.uid() = id );

create policy "Users can update their own settings."
    on user_settings for update
    using ( auth.uid() = id );

create policy "Users can insert their own settings."
    on user_settings for insert
    with check ( auth.uid() = id );

-- Create function to handle new user settings
create or replace function public.handle_new_user_settings()
returns trigger as $$
begin
    insert into public.user_settings (id)
    values (new.id);
    return new;
end;
$$ language plpgsql security definer;

-- Create trigger for new user settings
create trigger on_auth_user_created_settings
    after insert on auth.users
    for each row execute procedure public.handle_new_user_settings();

-- Create indexes for better performance
create index if not exists profiles_email_idx on public.profiles (email);
create index if not exists profiles_created_at_idx on public.profiles (created_at);

-- Grant necessary permissions
grant usage on schema public to anon, authenticated;
grant all on public.profiles to anon, authenticated;
grant all on public.user_settings to anon, authenticated; 