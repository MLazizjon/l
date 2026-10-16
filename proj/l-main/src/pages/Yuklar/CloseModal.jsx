import { useMemo, useState } from 'react';
import { X, Truck, Phone, MapPin, Route as RouteIcon, Wallet, UserPlus, Users } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { money, today, initials } from '../../utils/helpers';
import { t } from '../../i18n';
import {
  Button, IconButton, Overlay, Modal, ModalHead, ModalBody, ModalFoot, FormGrid, Field, Input,
  FormSelect, Textarea, Badge, Avatar, Req, Opt, SegTabs, SegTab,
} from '../../styles/ui';
import { toneOf, TRUCK_TYPES } from '../../data/constants';
import { Summary, DriverCard, Profit, SectionLabel } from './styles';

const EMPTY_DRIVER = { name: '', phone: '+998 ', truck: '', plate: '', truckType: TRUCK_TYPES[0] };

/* Yukni "yopish": haydovchi biriktiriladi va reys ma'lumotlari to'liq yoziladi.
   Yuk, haydovchi, narx va yo'l ma'lumotlari — hammasi majburiy. */
export default function CloseModal({ cargoItem, onClose }) {
  const { drivers, update, createAsync } = useData();
  const { user } = useAuth();
  const [mode, setMode] = useState(drivers.length ? 'existing' : 'new');
  const [nd, setNd] = useState(EMPTY_DRIVER);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    driverId: '',
    price: cargoItem.price || '',
    distance: '',
    loadDate: cargoItem.loadDate || today(),
    eta: '',
    driverPay: '',
    note: '',
  });

  // Bo'sh haydovchilar birinchi, keyin yo'ldagilar, oxirida dam olayotganlar
  const sorted = useMemo(() => {
    const order = { Faol: 0, "Yo'lda": 1, 'Dam olishda': 2 };
    return [...drivers].sort((a, b) => (order[a.status] ?? 3) - (order[b.status] ?? 3));
  }, [drivers]);

  const driver = drivers.find((d) => d.id === form.driverId);
  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const onNd = (e) => setNd((f) => ({ ...f, [e.target.name]: e.target.value }));
  const profit = (Number(form.price) || 0) - (Number(form.driverPay) || 0);

  const driverOk = mode === 'existing'
    ? !!form.driverId
    : nd.name.trim() && nd.phone.replace(/\D/g, '').length >= 9 && nd.truck.trim() && nd.plate.trim();
  const valid = driverOk && Number(form.price) > 0 && Number(form.distance) > 0 && form.loadDate && form.eta
    && form.driverPay !== '' && Number(form.driverPay) >= 0 && form.eta >= form.loadDate;

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!valid || saving) return;
    setSaving(true);
    let driverId = form.driverId;
    if (mode === 'new') {
      // Haydovchi bazaga yozilgach yukni unga bog'laymiz
      driverId = await createAsync('drivers', {
        name: nd.name.trim(), phone: nd.phone.trim(), truck: nd.truck.trim(), plate: nd.plate.trim().toUpperCase(),
        city: cargoItem.from, status: "Yo'lda",
      });
      if (!driverId) { setSaving(false); return; }
    }
    update('cargo', cargoItem.id, {
      driverId,
      price: form.price,
      status: "Yo'lda",
      closedBy: user.id,
      closedAt: new Date().toISOString(),
      trip: {
        distance: form.distance,
        loadDate: form.loadDate,
        eta: form.eta,
        driverPay: form.driverPay,
        note: form.note.trim(),
      },
    });
    if (mode === 'existing') update('drivers', driverId, { status: "Yo'lda" });
    onClose();
  };

  return (
    <Overlay onMouseDown={onClose}>
      <Modal as="form" $w="700px" onSubmit={onSubmit} onMouseDown={(e) => e.stopPropagation()} noValidate>
        <ModalHead>
          <div>
            <h2>{t('Yukni yopish')}</h2>
            <p>{t("Haydovchini biriktiring va reysning barcha ma'lumotlarini kiriting")}</p>
          </div>
          <IconButton type="button" onClick={onClose} aria-label={t('Yopish')}><X /></IconButton>
        </ModalHead>

        <ModalBody>
          <Summary>
            <div>
              <strong>{cargoItem.title}</strong>
              <span><MapPin />{cargoItem.from} → {cargoItem.to} · {cargoItem.weight || '—'} t{cargoItem.volume ? ` · ${cargoItem.volume} m³` : ''}{cargoItem.cargoType ? ` · ${cargoItem.cargoType}` : ''}</span>
            </div>
            <b>{money(cargoItem.price)}</b>
          </Summary>

          <SectionLabel><Truck /> {t('Haydovchi va mashina')}</SectionLabel>
          <SegTabs style={{ marginBottom: 12 }}>
            <SegTab type="button" $active={mode === 'existing'} onClick={() => setMode('existing')}><Users /> {t("Ro'yxatdan tanlash")}</SegTab>
            <SegTab type="button" $active={mode === 'new'} onClick={() => setMode('new')}><UserPlus /> {t('Yangi haydovchi')}</SegTab>
          </SegTabs>

          {mode === 'existing' ? (
            <>
              <FormGrid>
                <Field $full><span>{t('Haydovchi')}<Req>*</Req></span>
                  <FormSelect name="driverId" value={form.driverId} onChange={onChange}>
                    <option value="">{t('Tanlang...')}</option>
                    {sorted.map((d) => (
                      <option key={d.id} value={d.id}>{d.name} — {d.plate} ({t(d.status)})</option>
                    ))}
                  </FormSelect>
                </Field>
              </FormGrid>
              {driver && (
                <DriverCard>
                  <Avatar $dark $size={44}>{initials(driver.name)}</Avatar>
                  <div className="info">
                    <strong>{driver.name}</strong>
                    <span>{driver.truck} · <b>{driver.plate}</b></span>
                    <span><Phone />{driver.phone} · {driver.city}</span>
                  </div>
                  <Badge $tone={toneOf(driver.status)}>{t(driver.status)}</Badge>
                </DriverCard>
              )}
              {driver?.status === "Yo'lda" && (
                <p style={{ marginTop: 8, fontSize: 13, color: '#667085' }}>{t('Diqqat: bu haydovchi hozir boshqa reysda.')}</p>
              )}
            </>
          ) : (
            <FormGrid>
              <Field><span>{t('F.I.Sh.')}<Req>*</Req></span>
                <Input name="name" value={nd.name} onChange={onNd} placeholder="Jasur Rahimov" />
              </Field>
              <Field><span>{t('Telefon')}<Req>*</Req></span>
                <Input name="phone" value={nd.phone} onChange={onNd} inputMode="tel" />
              </Field>
              <Field><span>{t('Mashina rusumi')}<Req>*</Req></span>
                <Input name="truck" value={nd.truck} onChange={onNd} placeholder="MAN TGX 18.440" />
              </Field>
              <Field><span>{t('Davlat raqami')}<Req>*</Req></span>
                <Input name="plate" value={nd.plate} onChange={onNd} placeholder="30 A 123 BA" />
              </Field>
            </FormGrid>
          )}

          <SectionLabel><RouteIcon /> {t("Yo'l ma'lumotlari")}</SectionLabel>
          <FormGrid>
            <Field><span>{t('Masofa (km)')}<Req>*</Req></span>
              <Input name="distance" type="number" min="0" value={form.distance} onChange={onChange} placeholder="310" />
            </Field>
            <Field><span>{t('Yuklash sanasi')}<Req>*</Req></span>
              <Input name="loadDate" type="date" value={form.loadDate} onChange={onChange} />
            </Field>
            <Field><span>{t('Yetib borish sanasi')}<Req>*</Req></span>
              <Input name="eta" type="date" min={form.loadDate} value={form.eta} onChange={onChange} />
            </Field>
          </FormGrid>

          <SectionLabel><Wallet /> {t("To'lov")}</SectionLabel>
          <FormGrid>
            <Field><span>{t("Yuk narxi — mijoz to'lovi (so'm)")}<Req>*</Req></span>
              <Input name="price" type="number" min="0" value={form.price} onChange={onChange} />
            </Field>
            <Field><span>{t("Haydovchiga to'lov (so'm)")}<Req>*</Req></span>
              <Input name="driverPay" type="number" min="0" value={form.driverPay} onChange={onChange} placeholder="4500000" />
            </Field>
            <Field $full><span>{t("Yo'l haqida izoh")}<Opt>{t('ixtiyoriy')}</Opt></span>
              <Textarea name="note" value={form.note} onChange={onChange} placeholder={t("Tushirish manzili, qabul qiluvchi telefoni, to'xtash joylari...")} />
            </Field>
          </FormGrid>

          <Profit $neg={profit < 0}>
            <Wallet />
            <span>{t('Kompaniya foydasi')}</span>
            <b>{form.driverPay === '' ? '—' : money(profit)}</b>
          </Profit>
        </ModalBody>

        <ModalFoot>
          <Button type="button" $variant="ghost" onClick={onClose}>{t('Bekor qilish')}</Button>
          <Button type="submit" disabled={!valid || saving}>{t("Yuk yopildi — yo'lga chiqarish")}</Button>
        </ModalFoot>
      </Modal>
    </Overlay>
  );
}
