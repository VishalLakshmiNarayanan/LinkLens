-- Run this SQL in your Supabase SQL Editor to create the messages table

-- Create messages table
create table if not exists messages (
  id uuid default gen_random_uuid() primary key,
  user_id text not null,
  user_email text not null,
  user_name text,
  user_image text,
  content text not null,
  event_data jsonb,
  created_at timestamp with time zone default now()
);

-- Create index for faster queries
create index if not exists messages_created_at_idx on messages(created_at);
create index if not exists messages_user_id_idx on messages(user_id);

-- Enable Row Level Security (optional but recommended)
alter table messages enable row level security;

-- Create policy to allow all authenticated users to read messages
create policy "Anyone can read messages" on messages
  for select using (true);

-- Create policy to allow authenticated users to insert their own messages
create policy "Users can insert their own messages" on messages
  for insert with check (true);

