-- Create jobs table
create table public.jobs (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    category text not null,
    location text not null,
    description text not null,
    cv_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    created_by uuid references auth.users not null
);

-- Enable RLS
alter table public.jobs enable row level security;

-- Create policies
create policy "Jobs are viewable by everyone"
    on jobs for select
    using ( true );

create policy "Only admins can insert jobs"
    on jobs for insert
    with check (
        exists (
            select 1 from public.profiles
            where id = auth.uid()
            and role = 'admin'
        )
    );

create policy "Only admins can update jobs"
    on jobs for update
    using (
        exists (
            select 1 from public.profiles
            where id = auth.uid()
            and role = 'admin'
        )
    );

create policy "Only admins can delete jobs"
    on jobs for delete
    using (
        exists (
            select 1 from public.profiles
            where id = auth.uid()
            and role = 'admin'
        )
    );

-- Add role column to profiles
alter table public.profiles
add column role text default 'user'::text;

-- Create index for better performance
create index jobs_category_idx on public.jobs (category);
create index jobs_location_idx on public.jobs (location);
create index jobs_created_at_idx on public.jobs (created_at);

-- Grant permissions
grant all on public.jobs to anon, authenticated; 