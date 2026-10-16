import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Truck, User, Lock, Eye, EyeOff, AlertCircle, Factory, ArrowRight } from 'lucide-react';
import { useAuth, homePath } from '../../context/AuthContext';
import {
  Wrap, Visual, VisualTop, Route, Stop, Line, Mover, VisualText, FormSide, FormBox,
  Heading, InputWrap, ErrorBox, Submit, Divider, ShipperLink,
} from './styles';
import { t, LangSwitcher } from '../../i18n';
import { ThemeToggle } from '../../styles/ThemeMode';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  // Brauzer saqlab qo'ygan telefon/parolni o'zi to'ldirmasligi uchun:
  // maydonlar bosilmaguncha "faqat o'qish" holatida turadi
  const [editable, setEditable] = useState(false);
  const unlock = () => setEditable(true);

  const onChange = (e) => {
    setError(t(''));
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      setError(t('Login va parolni kiriting.'));
      return;
    }
    const user = login(form.username, form.password);
    if (!user) {
      setError(t("Login yoki parol noto'g'ri. Qaytadan tekshiring."));
      return;
    }
    navigate(homePath(user), { replace: true });
  };

  return (
    <Wrap>
      <Visual>
        <VisualTop>
          <span className="logo"><Truck /></span>
          <strong>{t("YukCRM")}</strong>
        </VisualTop>

        <Route>
          <Stop>
            <i />
            <div><strong>{t("Samarqand")}</strong><span>{t("Yuklandi, 08:40")}</span></div>
          </Stop>
          <Line><Mover><Truck /></Mover></Line>
          <Stop $end>
            <i />
            <div><strong>{t("Toshkent")}</strong><span>{t("Yetib borish, 14:10")}</span></div>
          </Stop>
        </Route>

        <VisualText>
          <h2>{t("Har bir yuk, haydovchi va zavod — bitta oynada.")}</h2>
          <p>{t("Buyurtmalarni qabul qiling, haydovchiga biriktiring va yo'lini kuzating.")}</p>
        </VisualText>
      </Visual>

      <FormSide>
        <FormBox onSubmit={onSubmit} noValidate autoComplete="off">
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}><LangSwitcher /><ThemeToggle /></div>
          <Heading>
            <h1>{t("Tizimga kirish")}</h1>
            <p>{t("Hisobingiz ma'lumotlarini kiriting")}</p>
          </Heading>

          <InputWrap>
            <span>{t("Login")}</span>
            <div>
              <User />
              <input
                name="username"
                value={form.username}
                onChange={onChange}
                onFocus={unlock}
                readOnly={!editable}
                placeholder={t("masalan, admin")}
                autoComplete="off"
                autoCapitalize="none"
                spellCheck={false}
              />
            </div>
          </InputWrap>

          <InputWrap>
            <span>{t("Parol")}</span>
            <div>
              <Lock />
              <input
                name="password"
                type={show ? t('text') : t('password')}
                value={form.password}
                onChange={onChange}
                placeholder="••••••••"
                onFocus={unlock}
                readOnly={!editable}
                autoComplete="new-password"
              />
              <button type="button" onClick={() => setShow((v) => !v)} aria-label={t("Parolni ko'rsatish")}>
                {show ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </InputWrap>

          {error && <ErrorBox><AlertCircle />{error}</ErrorBox>}

          <Submit type="submit">{t("Kirish")}</Submit>

          <Divider><span>{t("yoki")}</span></Divider>

          <ShipperLink as={Link} to="/kabinet">
            <span className="ico"><Factory /></span>
            <span className="txt">
              <strong>{t("Hamkor kabineti")}</strong>
              <small>{t("Zavod, broker yoki logistika kompaniyasi sifatida yuk joylash")}</small>
            </span>
            <ArrowRight className="arrow" />
          </ShipperLink>
        </FormBox>
      </FormSide>
    </Wrap>
  );
}