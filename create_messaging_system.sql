-- 1. Create conversations table
create table if not exists public.conversations (
  id uuid default gen_random_uuid() primary key,
  participant1_id uuid references auth.users not null,
  participant2_id uuid references auth.users not null,
  last_message text,
  last_message_at timestamp with time zone default now(),
  created_at timestamp with time zone default now(),
  unique(participant1_id, participant2_id)
);

-- 2. Create messages table
create table if not exists public.messages (
  id uuid default gen_random_uuid() primary key,
  conversation_id uuid references public.conversations on delete cascade not null,
  sender_id uuid references auth.users not null,
  content text not null,
  is_read boolean default false,
  created_at timestamp with time zone default now()
);

-- 3. Enable RLS
alter table public.conversations enable row level security;
alter table public.messages enable row level security;

-- 4. Policies for conversations
drop policy if exists "Users can view their own conversations" on public.conversations;
create policy "Users can view their own conversations"
  on public.conversations for select
  using ( auth.uid() = participant1_id or auth.uid() = participant2_id );

drop policy if exists "Users can insert their own conversations" on public.conversations;
create policy "Users can insert their own conversations"
  on public.conversations for insert
  with check ( auth.uid() = participant1_id or auth.uid() = participant2_id );

-- 5. Policies for messages
drop policy if exists "Users can view messages in their conversations" on public.messages;
create policy "Users can view messages in their conversations"
  on public.messages for select
  using (
    exists (
      select 1 from public.conversations
      where id = conversation_id
      and (participant1_id = auth.uid() or participant2_id = auth.uid())
    )
  );

drop policy if exists "Users can send messages in their conversations" on public.messages;
create policy "Users can send messages in their conversations"
  on public.messages for insert
  with check ( 
    auth.uid() = sender_id 
    and exists (
      select 1 from public.conversations
      where id = conversation_id
      and (participant1_id = auth.uid() or participant2_id = auth.uid())
    )
  );

drop policy if exists "Users can update read status of received messages" on public.messages;
create policy "Users can update read status of received messages"
  on public.messages for update
  using (
    exists (
      select 1 from public.conversations
      where id = conversation_id
      and (participant1_id = auth.uid() or participant2_id = auth.uid())
    )
  );

-- 6. Indexes for performance
create index if not exists conversations_participant1_idx on public.conversations(participant1_id);
create index if not exists conversations_participant2_idx on public.conversations(participant2_id);
create index if not exists messages_conversation_id_idx on public.messages(conversation_id);
create index if not exists messages_created_at_idx on public.messages(created_at);
