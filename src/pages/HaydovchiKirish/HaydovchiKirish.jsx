import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User, Lock, Eye, EyeOff, AlertCircle, ArrowLeft, Phone, MapPin, CheckCircle2, UserPlus, LogIn,
  Truck, Hash, Navigation, Building, PackageSearch, Container, Award,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { CITIES, TRUCK_TYPES } from '../../data/constants';
import { t, LangSwitcher } from '../../i18n';
import { ThemeToggle } from '../../styles/ThemeMode';
import {
  Wrap, Visual, VisualTop, VisualText, FormSide, Heading, InputWrap, ErrorBox, Submit,
} from '../Login/styles';
import { Box, BackLink, Tabs, Tab, Grid, LoginHint, Steps, Step, TopRow } from '../HamkorKirish/styles';

const EMPTY_SIGNUP = {
  name: '', phone: '+998 ', truck: '', plate: '', truckType: TRUCK_TYPES[0], experience: '',
  location: 'Toshkent', username: '', password: '', confirm: '',
};

/* Haydovchilar uchun kabinet: /haydovchi
   O'zi ro'yxatdan o'tadi (admin ro'yxatida "o'zi qo'shilgan" bo'lib ko'rinadi) yoki admin bergan login bilan kiradi. */
export default function HaydovchiKirish() {
  const { driverLogin, driverRegister, findDriverByLogin, loginTaken, lastDriverLogin } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState(lastDriverLogin ? 'signin' : 'signup');
  const [signin, setSignin] = useState({ username: lastDriverLogin, password: '' });
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
  const signinExists = signin.username.trim().length >= 3 ? !!findDriverByLogin(signin.username) : null;

  const onSignin = (e) => {
    e.preventDefault();
    if (!signin.username.trim() || !signin.password) return setError(t('Login va parolni kiriting.'));
    const res = driverLogin(signin.username, signin.password);
    if (res.error === 'not_found') return setError(t("Bunday login topilmadi. Avval ro'yxatdan o'ting."));
    if (res.error === 'wrong_password') return setError(t("Parol noto'g'ri. Qaytadan urinib ko'ring."));
    return navigate('/haydovchi/panel', { replace: true });
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
    if (!f.name.trim() || f.phone.replace(/\D/g, '').length < 9 || !f.truck.trim() || !f.plate.trim() || !f.location.trim()) {
      return setError(t("Ism, telefon, mashina, davlat raqami va hozirgi joyingizni to'ldiring."));
    }
    if (!/^[a-zA-Z0-9_.]{3,}$/.test(f.username.trim())) {
      return setError(t("Login kamida 3 ta belgi: lotin harflari, raqam, _ yoki . bo'lsin."));
    }
    if (f.password.length < 6) return setError(t("Parol kamida 6 ta belgidan iborat bo'lsin."));
    if (f.password !== f.confirm) return setError(t('Parollar bir xil emas.'));
    const res = driverRegister(f);
    if (res.error === 'taken') return setError(t('Bu login band. Boshqasini tanlang yoki kiring.'));
    return navigate('/haydovchi/panel', { replace: true });
  };

  return (
    <Wrap>
      <Visual>
        <VisualTop>
          <span className="logo"><Truck /></span>
          <strong>YukCRM · {t('Haydovchi kabineti')}</strong>
        </VisualTop>

        <Steps>
          <Step><i><UserPlus /></i><div><strong>{t("Ro'yxatdan o'ting")}</strong><span>{t('Ism, telefon va mashinangiz')}</span></div></Step>
          <Step><i><Navigation /></i><div><strong>{t('Joyingizni yangilang')}</strong><span>{t("Hozir qayerdasiz va qayerga bormoqchisiz")}</span></div></Step>
          <Step><i><PackageSearch /></i><div><strong>{t('Yuk oling')}</strong><span>{t('Dispetcher sizga mos yukni biriktiradi')}</span></div></Step>
        </Steps>

        <VisualText>
          <h2>{t('Haydovchilar uchun shaxsiy kabinet.')}</h2>
          <p>{t("Joyingiz va holatingizni o'zingiz yangilang — logistlarimiz yaqin atrofdagi yukni sizga beradi.")}</p>
        </VisualText>
      </Visual>

      <FormSide>
        <Box>
          <TopRow>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <BackLink as={Link} to="/login"><ArrowLeft /> {t('Xodimlar kirishi')}</BackLink>
              <BackLink as={Link} to="/kabinet"><Building /> {t('Hamkor kabineti')}</BackLink>
            </div>
            <div style={{ display: 'flex', gap: 8 }}><LangSwitcher /><ThemeToggle /></div>
          </TopRow>

          <Heading>
            <h1>{mode === 'signin' ? t('Haydovchi kabineti') : t("Ro'yxatdan o'tish")}</h1>
            <p>{mode === 'signin' ? t('Login va parolingizni kiriting') : t("Haydovchi sifatida login va parol yarating")}</p>
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
              <Grid>
                <InputWrap className="full">
                  <span>{t('F.I.Sh.')}</span>
                  <div><User /><input name="name" value={signup.name} onChange={setSu} placeholder={t('Jasur Rahimov')} autoFocus /></div>
                </InputWrap>
                <InputWrap>
                  <span>{t('Telefon')}</span>
                  <div><Phone /><input name="phone" value={signup.phone} onChange={setSu} inputMode="tel" /></div>
                </InputWrap>
                <InputWrap>
                  <span>{t('Hozirgi joyingiz')}</span>
                  <div>
                    <MapPin />
                    <input name="location" list="drv-cities" value={signup.location} onChange={setSu} placeholder={t('shahar yoki tuman')} />
                    <datalist id="drv-cities">{CITIES.map((c) => <option key={c} value={c} />)}</datalist>
                  </div>
                </InputWrap>
                <InputWrap>
                  <span>{t('Mashina rusumi')}</span>
                  <div><Truck /><input name="truck" value={signup.truck} onChange={setSu} placeholder={t('MAN TGX')} /></div>
                </InputWrap>
                <InputWrap>
                  <span>{t('Davlat raqami')}</span>
                  <div><Hash /><input name="plate" value={signup.plate} onChange={setSu} placeholder={t('30 A 123 BA')} autoCapitalize="characters" /></div>
                </InputWrap>
                <InputWrap>
                  <span>{t('Mashina turi')}</span>
                  <div>
                    <Container />
                    <select name="truckType" value={signup.truckType} onChange={setSu}>
                      {TRUCK_TYPES.map((x) => <option key={x} value={x}>{t(x)}</option>)}
                    </select>
                  </div>
                </InputWrap>
                <InputWrap>
                  <span>{t('Tajriba (yil)')}</span>
                  <div><Award /><input name="experience" type="number" min="0" value={signup.experience} onChange={setSu} placeholder="5" /></div>
                </InputWrap>
                <InputWrap className="full">
                  <span>{t('Login')}</span>
                  <div><User /><input name="username" value={signup.username} onChange={setSu} placeholder={t('lotin harflarida, masalan jasur90')} autoComplete="off" autoCapitalize="none" /></div>
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
