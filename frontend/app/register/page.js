import Navbar from '../../components/Navbar';
import RegisterForm from '../../components/RegisterForm';

export default function RegisterPage() {
  return (
    <div>
      <Navbar />
      <h1 className="text-center text-2xl font-bold mt-8">Registration</h1>
      <RegisterForm />
    </div>
  );
}