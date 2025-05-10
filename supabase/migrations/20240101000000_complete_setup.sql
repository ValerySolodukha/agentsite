-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create profiles table
create table public.profiles (
    id uuid references auth.users on delete cascade not null primary key,
    email text unique not null,
    full_name text,
    avatar_url text,
    role text default 'user'::text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create jobs table
create table public.jobs (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    category text not null,
    location text not null,
    description text not null,
    cv_url text,
    salary_range text,
    job_type text not null default 'full-time',
    experience_level text,
    requirements text[],
    benefits text[],
    is_active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    created_by uuid references auth.users not null
);

-- Create job applications table
create table public.job_applications (
    id uuid default uuid_generate_v4() primary key,
    job_id uuid references public.jobs on delete cascade not null,
    applicant_id uuid references auth.users on delete cascade not null,
    cv_url text not null,
    cover_letter text,
    status text default 'pending'::text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(job_id, applicant_id)
);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.jobs enable row level security;
alter table public.job_applications enable row level security;

-- Create policies for profiles
create policy "Public profiles are viewable by everyone"
    on profiles for select
    using ( true );

create policy "Users can update their own profile"
    on profiles for update
    using ( auth.uid() = id );

-- Create policies for jobs
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

-- Create policies for job applications
create policy "Users can view their own applications"
    on job_applications for select
    using ( auth.uid() = applicant_id );

create policy "Users can view applications for their posted jobs"
    on job_applications for select
    using (
        exists (
            select 1 from public.jobs
            where jobs.id = job_applications.job_id
            and jobs.created_by = auth.uid()
        )
    );

create policy "Users can create applications"
    on job_applications for insert
    with check ( auth.uid() = applicant_id );

create policy "Only job posters can update application status"
    on job_applications for update
    using (
        exists (
            select 1 from public.jobs
            where jobs.id = job_applications.job_id
            and jobs.created_by = auth.uid()
        )
    );

-- Create functions for automatic timestamps
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger handle_profiles_updated_at
    before update on public.profiles
    for each row execute procedure public.handle_updated_at();

create trigger handle_jobs_updated_at
    before update on public.jobs
    for each row execute procedure public.handle_updated_at();

create trigger handle_job_applications_updated_at
    before update on public.job_applications
    for each row execute procedure public.handle_updated_at();

-- Create function to handle new user creation
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

-- Create indexes for better performance
create index profiles_email_idx on public.profiles (email);
create index profiles_role_idx on public.profiles (role);
create index jobs_category_idx on public.jobs (category);
create index jobs_location_idx on public.jobs (location);
create index jobs_created_at_idx on public.jobs (created_at);
create index jobs_is_active_idx on public.jobs (is_active);
create index job_applications_job_id_idx on public.job_applications (job_id);
create index job_applications_applicant_id_idx on public.job_applications (applicant_id);
create index job_applications_status_idx on public.job_applications (status);

-- Grant necessary permissions
grant usage on schema public to anon, authenticated;
grant all on public.profiles to anon, authenticated;
grant all on public.jobs to anon, authenticated;
grant all on public.job_applications to anon, authenticated;

-- Insert default admin user (replace with actual admin user ID)
-- Note: You should replace 'your-admin-user-id' with the actual admin user's UUID
-- insert into public.profiles (id, email, role)
-- values ('your-admin-user-id', 'admin@example.com', 'admin'); 