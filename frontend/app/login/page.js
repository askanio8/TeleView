import Navbar from '../../components/Navbar';
import LoginForm from '../../components/LoginForm';

export default function LoginPage() {
  return (
    <div>
      <Navbar />
      <h1 className="text-center text-2xl font-bold mt-8">Login</h1>
      <LoginForm />
    </div>
  );
}