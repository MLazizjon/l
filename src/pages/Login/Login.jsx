import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, User, Lock, Eye, EyeOff, ShieldCheck, UserRound, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  Wrap, Visual, VisualTop, Route, Stop, Line, Mover, VisualText, FormSide, FormBox,
  Heading, InputWrap, ErrorBox, Submit, DemoRow, DemoBtn,
} from './styles';

const DEMO = [
  { label: 'Admin', icon: ShieldCheck, username: 'admin', password: 'admin123' },
  { label: 'User', icon: UserRound, username: 'user', password: 'user123' },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');

  const onChange = (e) => {
    setError('');
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      setError('Login va parolni kiriting.');
      return;
    }
    const user = login(form.username, form.password);
    if (!user) {
      setError("Login yoki parol noto'g'ri. Qaytadan tekshiring.");
      return;
    }
    navigate(user.role === 'admin' ? '/dashboard' : '/yuklar', { replace: true });
  };

  return (
    <Wrap>
      <Visual>
        <VisualTop>
          <span className="logo"><Truck /></span>
          <strong>YukCRM</strong>
        </VisualTop>

        <Route>
          <Stop>
            <i />
            <div><strong>Samarqand</strong><span>Yuklandi, 08:40</span></div>
          </Stop>
          <Line><Mover><Truck /></Mover></Line>
          <Stop $end>
            <i />
            <div><strong>Toshkent</strong><span>Yetib borish, 14:10</span></div>
          </Stop>
        </Route>

        <VisualText>
          <h2>Har bir yuk, haydovchi va zavod — bitta oynada.</h2>
          <p>Buyurtmalarni qabul qiling, haydovchiga biriktiring va yo'lini kuzating.</p>
        </VisualText>
      </Visual>

      <FormSide>
        <FormBox onSubmit={onSubmit} noValidate>
          <Heading>
            <h1>Tizimga kirish</h1>
            <p>Hisobingiz ma'lumotlarini kiriting</p>
          </Heading>

          <InputWrap>
            <span>Login</span>
            <div>
              <User />
              <input name="username" value={form.username} onChange={onChange} placeholder="masalan, admin" autoComplete="username" autoFocus />
            </div>
          </InputWrap>

          <InputWrap>
            <span>Parol</span>
            <div>
              <Lock />
              <input
                name="password"
                type={show ? 'text' : 'password'}
                value={form.password}
                onChange={onChange}
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <button type="button" onClick={() => setShow((v) => !v)} aria-label={show ? 'Parolni yashirish' : "Parolni ko'rsatish"}>
                {show ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </InputWrap>

          {error && <ErrorBox><AlertCircle />{error}</ErrorBox>}

          <Submit type="submit">Kirish</Submit>

          {/* <DemoRow>
            <span>Sinov uchun kirish:</span>
            <div>
              {DEMO.map(({ label, icon: Icon, username, password }) => (
                <DemoBtn key={label} type="button" onClick={() => { setError(''); setForm({ username, password }); }}>
                  <Icon /> {label}
                </DemoBtn>
              ))}
            </div>
          </DemoRow> */}
        </FormBox>
      </FormSide>
    </Wrap>
  );
}
