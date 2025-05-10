-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create jobs table
create table public.jobs (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    category text not null,
    location text not null,
    description text not null,
    link_url text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.jobs enable row level security;

-- Create policies for jobs
create policy "Jobs are viewable by everyone"
    on jobs for select
    using ( true );

create policy "Anyone can insert jobs"
    on jobs for insert
    with check ( true );

create policy "Anyone can update jobs"
    on jobs for update
    using ( true );

create policy "Anyone can delete jobs"
    on jobs for delete
    using ( true );

-- Create function for automatic timestamps
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Create trigger for updated_at
create trigger handle_jobs_updated_at
    before update on public.jobs
    for each row execute procedure public.handle_updated_at();

-- Create indexes for better performance
create index jobs_category_idx on public.jobs (category);
create index jobs_location_idx on public.jobs (location);
create index jobs_created_at_idx on public.jobs (created_at);

-- Grant necessary permissions
grant usage on schema public to anon, authenticated;
grant all on public.jobs to anon, authenticated; 