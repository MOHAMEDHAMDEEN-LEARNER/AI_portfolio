-- Simple queries to view all user data in a professional way

-- 1. View all users with their profile data (most comprehensive view)
SELECT 
    up.id,
    up.email,
    up.full_name,
    up.mobile_number,
    up.course,
    up.year_of_graduation,
    up.college_name,
    up.profile_completed,
    up.account_status,
    up.created_at as "Signup Date",
    au.last_sign_in_at as "Last Login",
    au.email_confirmed_at as "Email Confirmed",
    CASE 
        WHEN au.email_confirmed_at IS NOT NULL THEN 'Verified'
        ELSE 'Not Verified'
    END as "Email Status"
FROM public.user_profiles up
LEFT JOIN auth.users au ON up.id = au.id
ORDER BY up.created_at DESC;

-- 2. Simple view of just essential user data
SELECT 
    full_name as "Name",
    email as "Email", 
    mobile_number as "Phone",
    course as "Course",
    college_name as "College",
    created_at as "Joined"
FROM public.user_profiles 
ORDER BY created_at DESC;

-- 3. View users with authentication status
SELECT 
    up.full_name,
    up.email,
    CASE 
        WHEN au.email_confirmed_at IS NOT NULL THEN 'Email Verified'
        ELSE 'Email Not Verified'
    END as email_status,
    up.profile_completed,
    up.account_status,
    CASE 
        WHEN au.last_sign_in_at IS NOT NULL THEN 'Has logged in'
        ELSE 'Never logged in'
    END as login_status
FROM public.user_profiles up
LEFT JOIN auth.users au ON up.id = au.id;

-- 4. Count statistics
SELECT 
    COUNT(*) as total_users,
    COUNT(CASE WHEN au.email_confirmed_at IS NOT NULL THEN 1 END) as verified_users,
    COUNT(CASE WHEN up.profile_completed = true THEN 1 END) as completed_profiles,
    COUNT(DISTINCT up.course) as unique_courses
FROM public.user_profiles up
LEFT JOIN auth.users au ON up.id = au.id;