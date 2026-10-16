import { X, Package, MapPin, Wallet, Info } from 'lucide-react';
import { CITIES, TRUCK_TYPES, CARGO_TYPES, CARGO_STATUS } from '../../data/constants';
import { today } from '../../utils/helpers';
import { t } from '../../i18n';
import {
  Button, IconButton, Overlay, Modal, ModalHead, ModalBody, ModalFoot, FormGrid, Field, Input,
  FormSelect, Textarea, Req, Opt,
} from '../../styles/ui';
import { Group, GroupTitle, ErrorLine } from './styles';

export const EMPTY_CARGO = {
  title: '', cargoType: '', from: '', to: '', weight: '', volume: '', price: '', phone: '+998 ',
  truckType: '', loadDate: today(), note: '', status: 'Kutilmoqda',
};

/* Majburiy: nomi, turi, yo'nalish, og'irlik, narx, telefon.
   Ixtiyoriy: hajm, mashina turi, yuklash sanasi, izoh. */
export const cargoErrors = (f) => {
  const e = [];
  if (!String(f.title || '').trim()) e.push('title');
  if (!String(f.cargoType || '').trim()) e.push('cargoType');
  if (!String(f.from || '').trim()) e.push('from');
  if (!String(f.to || '').trim()) e.push('to');
  if (!(Number(f.weight) > 0)) e.push('weight');
  if (!(Number(f.price) > 0)) e.push('price');
  if (String(f.phone || '').replace(/\D/g, '').length < 9) e.push('phone');
  return e;
};

export const sameRoute = (f) =>
  f.from && f.to && f.from.trim().toLowerCase() === f.to.trim().toLowerCase();

export const cargoPayload = (f) => ({
  title: f.title.trim(),
  cargoType: f.cargoType.trim(),
  from: f.from.trim(),
  to: f.to.trim(),
  weight: f.weight,
  volume: f.volume,
  price: f.price,
  phone: f.phone.trim(),
  truckType: f.truckType,
  loadDate: f.loadDate,
  note: (f.note || '').trim(),
});

/* Yuk qo'shish / tahrirlash oynasi — hamkor kabineti va admin uchun bitta forma */
export default function CargoForm({
  title, subtitle, form, setForm, onSubmit, onClose, top, submitLabel, showStatus,
}) {
  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const errors = cargoErrors(form);
  const same = sameRoute(form);
  const valid = !errors.length && !same;

  const submit = (e) => {
    e.preventDefault();
    if (valid) onSubmit();
  };

  return (
    <Overlay onMouseDown={onClose}>
      <Modal as="form" $w="700px" onSubmit={submit} onMouseDown={(e) => e.stopPropagation()} noValidate>
        <ModalHead>
          <div>
            <h2>{title}</h2>
            <p>{subtitle || t('Qizil yulduzcha (*) bilan belgilangan maydonlar majburiy')}</p>
          </div>
          <IconButton type="button" onClick={onClose} aria-label={t('Yopish')}><X /></IconButton>
        </ModalHead>

        <ModalBody>
          {top}

          <Group>
            <GroupTitle><Package /> {t('Yuk haqida')}</GroupTitle>
            <FormGrid>
              <Field $full><span>{t('Yuk nomi')}<Req>*</Req></span>
                <Input name="title" value={form.title} onChange={onChange} placeholder={t('masalan, Sement M400, qopda')} autoFocus />
              </Field>
              <Field><span>{t('Yuk turi')}<Req>*</Req></span>
                <Input name="cargoType" list="cargo-types" value={form.cargoType} onChange={onChange} placeholder={t('Tanlang yoki yozing')} />
                <datalist id="cargo-types">{CARGO_TYPES.map((c) => <option key={c} value={t(c)} />)}</datalist>
              </Field>
              <Field><span>{t("Og'irlik (tonna)")}<Req>*</Req></span>
                <Input name="weight" type="number" min="0" step="0.1" value={form.weight} onChange={onChange} placeholder="20" />
              </Field>
              <Field><span>{t('Hajm (m³)')}<Opt>{t('ixtiyoriy')}</Opt></span>
                <Input name="volume" type="number" min="0" step="0.1" value={form.volume} onChange={onChange} placeholder="82" />
              </Field>
              <Field><span>{t('Mashina turi')}<Opt>{t('ixtiyoriy')}</Opt></span>
                <FormSelect name="truckType" value={form.truckType} onChange={onChange}>
                  <option value="">{t("Farqi yo'q")}</option>
                  {TRUCK_TYPES.map((tt) => <option key={tt} value={tt}>{t(tt)}</option>)}
                </FormSelect>
              </Field>
            </FormGrid>
          </Group>

          <Group>
            <GroupTitle><MapPin /> {t("Yo'nalish")}</GroupTitle>
            <FormGrid>
              <Field><span>{t('Qayerdan')}<Req>*</Req></span>
                <Input name="from" list="cities" value={form.from} onChange={onChange} placeholder={t('Shahar')} />
              </Field>
              <Field><span>{t('Qayerga')}<Req>*</Req></span>
                <Input name="to" list="cities" value={form.to} onChange={onChange} placeholder={t('Shahar')} />
              </Field>
              <datalist id="cities">{CITIES.map((c) => <option key={c} value={c} />)}</datalist>
              <Field><span>{t('Yuklash sanasi')}<Opt>{t('ixtiyoriy')}</Opt></span>
                <Input name="loadDate" type="date" value={form.loadDate || ''} onChange={onChange} />
              </Field>
            </FormGrid>
            {same && <ErrorLine>{t("Qayerdan va qayerga bir xil bo'lmasin.")}</ErrorLine>}
          </Group>

          <Group>
            <GroupTitle><Wallet /> {t("Narx va bog'lanish")}</GroupTitle>
            <FormGrid>
              <Field><span>{t("Narx (so'm)")}<Req>*</Req></span>
                <Input name="price" type="number" min="0" value={form.price} onChange={onChange} placeholder="5000000" />
              </Field>
              <Field><span>{t("Bog'lanish telefoni")}<Req>*</Req></span>
                <Input name="phone" value={form.phone} onChange={onChange} inputMode="tel" />
              </Field>
              {showStatus && (
                <Field $full><span>{t('Holat')}</span>
                  <FormSelect name="status" value={form.status} onChange={onChange}>
                    {CARGO_STATUS.map((s) => <option key={s} value={s}>{t(s)}</option>)}
                  </FormSelect>
                </Field>
              )}
              <Field $full><span><Info size={13} style={{ verticalAlign: -2 }} /> {t('Izoh')}<Opt>{t('ixtiyoriy')}</Opt></span>
                <Textarea name="note" value={form.note || ''} onChange={onChange} placeholder={t('Yuklash vaqti, manzil, maxsus talablar...')} />
              </Field>
            </FormGrid>
          </Group>
        </ModalBody>

        <ModalFoot>
          <Button type="button" $variant="ghost" onClick={onClose}>{t('Bekor qilish')}</Button>
          <Button type="submit" disabled={!valid}>{submitLabel || t('Saqlash')}</Button>
        </ModalFoot>
      </Modal>
    </Overlay>
  );
}
