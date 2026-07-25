-- LOOP DEMO WORKSPACE SEED SCRIPT
-- Run this script in the Supabase SQL Editor to seed the three test accounts 
-- mapped to the same workspace, allowing the grader to test role-based access.

-- 1. Create Admin User
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role)
VALUES (
  'a1111111-1111-1111-1111-111111111111',
  'admin@loop.intel',
  crypt('loop12345', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Admin Demo"}',
  'authenticated',
  'authenticated'
) ON CONFLICT (id) DO NOTHING;

-- 2. Create Analyst User
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role)
VALUES (
  'a2222222-2222-2222-2222-222222222222',
  'analyst@loop.intel',
  crypt('loop12345', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Analyst Demo"}',
  'authenticated',
  'authenticated'
) ON CONFLICT (id) DO NOTHING;

-- 3. Create Viewer User
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role)
VALUES (
  'a3333333-3333-3333-3333-333333333333',
  'viewer@loop.intel',
  crypt('loop12345', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Viewer Demo"}',
  'authenticated',
  'authenticated'
) ON CONFLICT (id) DO NOTHING;

-- 4. Move Analyst and Viewer to the Admin's automatically provisioned workspace
DO $$
DECLARE
  v_admin_ws_id uuid;
  v_analyst_ws_id uuid;
  v_viewer_ws_id uuid;
BEGIN
  -- Get admin's workspace ID
  SELECT workspace_id INTO v_admin_ws_id 
  FROM public.workspace_members 
  WHERE user_id = 'a1111111-1111-1111-1111-111111111111';

  -- Get analyst's workspace ID
  SELECT workspace_id INTO v_analyst_ws_id 
  FROM public.workspace_members 
  WHERE user_id = 'a2222222-2222-2222-2222-222222222222';

  -- Get viewer's workspace ID
  SELECT workspace_id INTO v_viewer_ws_id 
  FROM public.workspace_members 
  WHERE user_id = 'a3333333-3333-3333-3333-333333333333';

  -- Update analyst membership to point to admin's workspace and change role to ANALYST
  UPDATE public.workspace_members 
  SET workspace_id = v_admin_ws_id, role = 'ANALYST' 
  WHERE user_id = 'a2222222-2222-2222-2222-222222222222';

  -- Update viewer membership to point to admin's workspace and change role to VIEWER
  UPDATE public.workspace_members 
  SET workspace_id = v_admin_ws_id, role = 'VIEWER' 
  WHERE user_id = 'a3333333-3333-3333-3333-333333333333';

  -- Delete the unused workspaces that were created automatically by triggers
  IF v_analyst_ws_id IS NOT NULL AND v_analyst_ws_id != v_admin_ws_id THEN
    DELETE FROM public.workspaces WHERE id = v_analyst_ws_id;
  END IF;
  
  IF v_viewer_ws_id IS NOT NULL AND v_viewer_ws_id != v_admin_ws_id THEN
    DELETE FROM public.workspaces WHERE id = v_viewer_ws_id;
  END IF;
END $$;
