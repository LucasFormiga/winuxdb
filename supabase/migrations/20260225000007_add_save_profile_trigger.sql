-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created_v2
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
