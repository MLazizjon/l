import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User, Lock, Eye, EyeOff, AlertCircle, ArrowLeft, Building2, Phone, MapPin, Package,
  CheckCircle2, UserPlus, LogIn, Truck, ClipboardList, Boxes,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { CITIES } from '../../data/constants';
import { PARTNERS, PARTNER_TYPES } from '../../data/partners';
import { t, LangSwitcher } from '../../i18n';
import { ThemeToggle } from '../../styles/ThemeMode';
import {
  Wrap, Visual, VisualTop, VisualText, FormSide, Heading, InputWrap, ErrorBox, Submit,
} from '../Login/styles';
import { Box, BackLink, Tabs, Tab, Grid, LoginHint, Steps, Step, TypePick, TopRow } from './styles';

const EMPTY_SIGNUP = {
  name: '', contact: '', phone: '+998 ', city: 'Toshkent', product: '', username: '', password: '', confirm: '',
};

/* Zavod, broker va logistika kompaniyalari uchun bitta havola: /kabinet */
export default function HamkorKirish() {
  const { partnerLogin, partnerRegister, findPartnersByLogin, loginTaken, lastPartnerLogin } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState(lastPartnerLogin ? 'signin' : 'signup');
  const [type, setType] = useState('factory');
  const [signin, setSignin] = useState({ username: lastPartnerLogin, password: '' });
  const [signup, setSignup] = useState(EMPTY_SIGNUP);
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');

  const switchTo = (next, username = '') => {
    setError('');
    setShow(false);
    setMode(next);
    if (next === 'signin') setSignin({ username, password: '' });
    else setSignup((f) => ({ ...f, username }));
  };

  /* ---------- Kirish ---------- */
  const signinExists = signin.username.trim().length >= 3 ? findPartnersByLogin(signin.username).length > 0 : null;

  const onSignin = (e) => {
    e.preventDefault();
    if (!signin.username.trim() || !signin.password) return setError(t('Login va parolni kiriting.'));
    const res = partnerLogin(signin.username, signin.password);
    if (res.error === 'not_found') return setError(t("Bunday login topilmadi. Avval ro'yxatdan o'ting."));
    if (res.error === 'wrong_password') return setError(t("Parol noto'g'ri. Qaytadan urinib ko'ring."));
    if (res.error === 'inactive') return setError(t('Hisobingiz vaqtincha faol emas. Administrator bilan bog\'laning.'));
    return navigate('/kabinet/panel', { replace: true });
  };

  /* ---------- Ro'yxatdan o'tish ---------- */
  const signupTaken = signup.username.trim().length >= 3 && loginTaken(signup.username);
  const setSu = (e) => {
    setError('');
    setSignup((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const onSignup = (e) => {
    e.preventDefault();
    const f = signup;
    if (!f.name.trim() || !f.contact.trim() || f.phone.replace(/\D/g, '').length < 9) {
      return setError(t("Nomi, mas'ul shaxs va telefonni to'ldiring."));
    }
    if (!/^[a-zA-Z0-9_.]{3,}$/.test(f.username.trim())) {
      return setError(t("Login kamida 3 ta belgi: lotin harflari, raqam, _ yoki . bo'lsin."));
    }
    if (f.password.length < 6) return setError(t("Parol kamida 6 ta belgidan iborat bo'lsin."));
    if (f.password !== f.confirm) return setError(t('Parollar bir xil emas.'));
    const res = partnerRegister(type, f);
    if (res.error === 'taken') return setError(t('Bu login band. Boshqasini tanlang yoki kiring.'));
    return navigate('/kabinet/panel', { replace: true });
  };

  return (
    <Wrap>
      <Visual>
        <VisualTop>
          <span className="logo"><Boxes /></span>
          <strong>YukCRM · {t('Hamkor kabineti')}</strong>
        </VisualTop>

        <Steps>
          <Step><i><ClipboardList /></i><div><strong>{t('Yukni joylang')}</strong><span>{t('Nima, qancha, qayerdan, qayerga va narxi')}</span></div></Step>
          <Step><i><Truck /></i><div><strong>{t('Dispetcher mashina topadi')}</strong><span>{t("Haydovchi va mashina raqami sizga ko'rinadi")}</span></div></Step>
          <Step><i><CheckCircle2 /></i><div><strong>{t('Holatini kuzating')}</strong><span>{t("Kutilmoqda → Yo'lda → Yetkazildi")}</span></div></Step>
        </Steps>

        <VisualText>
          <h2>{t('Zavodlar, brokerlar va logistika kompaniyalari uchun yagona kabinet.')}</h2>
          <p>{t("O'z kabinetingizdan yuk joylang — logistlarimiz darhol ko'radi va haydovchi biriktiradi.")}</p>
        </VisualText>
      </Visual>

      <FormSide>
        <Box>
          <TopRow>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <BackLink as={Link} to="/login"><ArrowLeft /> {t('Xodimlar kirishi')}</BackLink>
              <BackLink as={Link} to="/haydovchi"><Truck /> {t('Haydovchi kabineti')}</BackLink>
            </div>
            <div style={{ display: 'flex', gap: 8 }}><LangSwitcher /><ThemeToggle /></div>
          </TopRow>

          <Heading>
            <h1>{mode === 'signin' ? t('Hamkor kabineti') : t("Ro'yxatdan o'tish")}</h1>
            <p>{mode === 'signin' ? t('Login va parolingizni kiriting') : t('Kompaniyangiz uchun login va parol yarating')}</p>
          </Heading>

          <Tabs role="tablist">
            <Tab type="button" role="tab" aria-selected={mode === 'signin'} $active={mode === 'signin'} onClick={() => switchTo('signin', signup.username)}>
              <LogIn /> {t('Kirish')}
            </Tab>
            <Tab type="button" role="tab" aria-selected={mode === 'signup'} $active={mode === 'signup'} onClick={() => switchTo('signup', signin.username)}>
              <UserPlus /> {t("Ro'yxatdan o'tish")}
            </Tab>
          </Tabs>

          {mode === 'signin' ? (
            <form onSubmit={onSignin} noValidate key="signin" autoComplete="off">
              <InputWrap>
                <span>{t('Login')}</span>
                <div>
                  <User />
                  <input
                    value={signin.username}
                    onChange={(e) => { setError(''); setSignin((f) => ({ ...f, username: e.target.value })); }}
                    placeholder={t('loginingiz')}
                    autoComplete="off"
                    autoCapitalize="none"
                    autoFocus
                  />
                </div>
              </InputWrap>

              {signinExists === true && <LoginHint $ok><CheckCircle2 /> {t('Hisob topildi — parolni kiriting')}</LoginHint>}
              {signinExists === false && (
                <LoginHint>
                  <AlertCircle /> {t("Bunday login yo'q.")}
                  <button type="button" onClick={() => switchTo('signup', signin.username)}>{t("Ro'yxatdan o'ting")}</button>
                </LoginHint>
              )}

              <InputWrap>
                <span>{t('Parol')}</span>
                <div>
                  <Lock />
                  <input
                    type={show ? 'text' : 'password'}
                    value={signin.password}
                    onChange={(e) => { setError(''); setSignin((f) => ({ ...f, password: e.target.value })); }}
                    placeholder="••••••••"
                    autoComplete="new-password"
                  />
                  <button type="button" onClick={() => setShow((v) => !v)} aria-label={t("Parolni ko'rsatish")}>
                    {show ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </InputWrap>

              {error && <ErrorBox><AlertCircle />{error}</ErrorBox>}
              <Submit type="submit">{t('Kabinetga kirish')}</Submit>
            </form>
          ) : (
            <form onSubmit={onSignup} noValidate key="signup" autoComplete="off">
              <TypePick>
                {PARTNER_TYPES.map((k) => {
                  const I = PARTNERS[k].icon;
                  return (
                    <button type="button" key={k} aria-pressed={type === k} onClick={() => setType(k)}>
                      <I /> <span>{t(PARTNERS[k].one)}</span>
                    </button>
                  );
                })}
              </TypePick>
              <Grid>
                <InputWrap className="full">
                  <span>{type === 'factory' ? t('Zavod nomi') : t('Kompaniya nomi')}</span>
                  <div><Building2 /><input name="name" value={signup.name} onChange={setSu} placeholder={type === 'factory' ? 'Zarafshon Sement' : 'Silk Road Logistics'} autoFocus /></div>
                </InputWrap>
                <InputWrap>
                  <span>{t("Mas'ul shaxs")}</span>
                  <div><User /><input name="contact" value={signup.contact} onChange={setSu} placeholder={t('F.I.Sh.')} /></div>
                </InputWrap>
                <InputWrap>
                  <span>{t('Telefon')}</span>
                  <div><Phone /><input name="phone" value={signup.phone} onChange={setSu} inputMode="tel" /></div>
                </InputWrap>
                <InputWrap className={type === 'factory' ? '' : 'full'}>
                  <span>{t('Shahar')}</span>
                  <div>
                    <MapPin />
                    <select name="city" value={signup.city} onChange={setSu}>
                      {CITIES.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </InputWrap>
                {type === 'factory' && (
                  <InputWrap>
                    <span>{t('Mahsulot')}</span>
                    <div><Package /><input name="product" value={signup.product} onChange={setSu} placeholder={t('sement, un...')} /></div>
                  </InputWrap>
                )}
                <InputWrap className="full">
                  <span>{t('Login')}</span>
                  <div><User /><input name="username" value={signup.username} onChange={setSu} placeholder={t('lotin harflarida, masalan zarafshon')} autoComplete="off" autoCapitalize="none" /></div>
                </InputWrap>
                {signupTaken && (
                  <LoginHint className="full">
                    <AlertCircle /> {t('Bu login allaqachon bor.')}
                    <button type="button" onClick={() => switchTo('signin', signup.username)}>{t('Shu login bilan kirish')}</button>
                  </LoginHint>
                )}
                <InputWrap>
                  <span>{t('Parol')}</span>
                  <div>
                    <Lock />
                    <input name="password" type={show ? 'text' : 'password'} value={signup.password} onChange={setSu} placeholder={t('kamida 6 belgi')} autoComplete="new-password" />
                    <button type="button" onClick={() => setShow((v) => !v)} aria-label={t("Parolni ko'rsatish")}>
                      {show ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                </InputWrap>
                <InputWrap>
                  <span>{t('Parolni takrorlang')}</span>
                  <div><Lock /><input name="confirm" type={show ? 'text' : 'password'} value={signup.confirm} onChange={setSu} placeholder="••••••" autoComplete="new-password" /></div>
                </InputWrap>
              </Grid>

              {error && <ErrorBox><AlertCircle />{error}</ErrorBox>}
              <Submit type="submit" disabled={signupTaken}>{t('Hisob yaratish va kirish')}</Submit>
            </form>
          )}
        </Box>
      </FormSide>
    </Wrap>
  );
}
