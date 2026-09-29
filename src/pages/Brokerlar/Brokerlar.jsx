import { useMemo, useState } from 'react';
import { Plus, Search as SearchIcon, Pencil, Trash2, X, Handshake, Phone } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import useCrud from '../../hooks/useCrud';
import { BROKER_STATUS, toneOf } from '../../data/constants';
import { initials, matches, shortMoney } from '../../utils/helpers';
import {
  Page, PageHead, PageTitle, PageSub, Button, IconButton, Chips, Chip, Badge, Empty,
  Card, Avatar, Overlay, Modal, ModalHead, ModalBody, ModalFoot, FormGrid, Field, Input,
  FormSelect, ConfirmBox,
} from '../../styles/ui';
import { Grid, BrokerCard, Top, Company, Contact, Stats, CardActions, TopBar, SearchBox } from './styles';

const EMPTY = { name: '', company: '', phone: '+998 ', commission: '5', status: 'Faol' };

export default function Brokerlar() {
  const { brokers, cargo, create, update, remove } = useData();
  const { isAdmin } = useAuth();
  const crud = useCrud(EMPTY);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('Barchasi');

  const stats = useMemo(() => {
    const map = {};
    cargo.forEach((c) => {
      if (!c.brokerId || c.status === 'Bekor qilindi') return;
      map[c.brokerId] = map[c.brokerId] || { deals: 0, sum: 0 };
      map[c.brokerId].deals += 1;
      map[c.brokerId].sum += Number(c.price) || 0;
    });
    return map;
  }, [cargo]);

  const rows = brokers
    .filter((b) => status === 'Barchasi' || b.status === status)
    .filter((b) => matches(b, query, ['name', 'company', 'phone']));

  const onSave = (e) => {
    e.preventDefault();
    const payload = { ...crud.form };
    delete payload.id;
    if (crud.editId) update('brokers', crud.editId, payload);
    else create('brokers', payload);
    crud.close();
  };

  return (
    <Page>
      <PageHead>
        <div>
          <PageTitle>Brokerlar</PageTitle>
          <PageSub>Yuk topib beruvchi hamkorlar, ularning ulushi va aylanmasi.</PageSub>
        </div>
        {isAdmin && <Button onClick={crud.openCreate}><Plus /> Broker qo'shish</Button>}
      </PageHead>

      <TopBar>
        <Chips>
          {['Barchasi', ...BROKER_STATUS].map((s) => (
            <Chip key={s} $active={status === s} onClick={() => setStatus(s)}>
              {s} <b>{s === 'Barchasi' ? brokers.length : brokers.filter((b) => b.status === s).length}</b>
            </Chip>
          ))}
        </Chips>
        <SearchBox>
          <SearchIcon />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Broker yoki kompaniya" />
        </SearchBox>
      </TopBar>

      {rows.length ? (
        <Grid>
          {rows.map((b) => {
            const s = stats[b.id] || { deals: 0, sum: 0 };
            return (
              <BrokerCard key={b.id} $inactive={b.status !== 'Faol'}>
                <Top>
                  <Avatar $size={46} $square $dark>{initials(b.company)}</Avatar>
                  <Badge $tone={toneOf(b.status)}>{b.status}</Badge>
                </Top>
                <Company>
                  <h3>{b.company}</h3>
                  <p>{b.name}</p>
                </Company>
                <Contact href={`tel:${b.phone.replace(/\s/g, '')}`}><Phone />{b.phone}</Contact>
                <Stats>
                  <div><b>{s.deals}</b><span>Bitimlar</span></div>
                  <div><b>{shortMoney(s.sum)}</b><span>Aylanma</span></div>
                  <div><b>{b.commission}%</b><span>Ulush</span></div>
                </Stats>
                {isAdmin && (
                  <CardActions>
                    <Button $variant="ghost" onClick={() => crud.openEdit(b)}><Pencil /> Tahrirlash</Button>
                    <IconButton $danger onClick={() => crud.setDeleteId(b.id)} aria-label="O'chirish"><Trash2 /></IconButton>
                  </CardActions>
                )}
              </BrokerCard>
            );
          })}
        </Grid>
      ) : (
        <Card>
          <Empty>
            <Handshake />
            <h4>Broker topilmadi</h4>
            <p>Qidiruvni o'zgartiring yoki yangi broker qo'shing.</p>
          </Empty>
        </Card>
      )}

      {crud.open && (
        <Overlay onMouseDown={crud.close}>
          <Modal as="form" onSubmit={onSave} onMouseDown={(e) => e.stopPropagation()}>
            <ModalHead>
              <div>
                <h2>{crud.editId ? 'Brokerni tahrirlash' : 'Yangi broker'}</h2>
                <p>Kompaniya va aloqa ma'lumotlari</p>
              </div>
              <IconButton type="button" onClick={crud.close} aria-label="Yopish"><X /></IconButton>
            </ModalHead>
            <ModalBody>
              <FormGrid>
                <Field $full><span>Kompaniya</span>
                  <Input name="company" value={crud.form.company} onChange={crud.onChange} placeholder="TezYuk Logistics" required />
                </Field>
                <Field><span>Mas'ul shaxs</span>
                  <Input name="name" value={crud.form.name} onChange={crud.onChange} placeholder="Ism familiya" />
                </Field>
                <Field><span>Telefon</span>
                  <Input name="phone" value={crud.form.phone} onChange={crud.onChange} />
                </Field>
                <Field><span>Ulush (%)</span>
                  <Input name="commission" type="number" min="0" step="0.5" value={crud.form.commission} onChange={crud.onChange} />
                </Field>
                <Field><span>Holat</span>
                  <FormSelect name="status" value={crud.form.status} onChange={crud.onChange}>
                    {BROKER_STATUS.map((s) => <option key={s}>{s}</option>)}
                  </FormSelect>
                </Field>
              </FormGrid>
            </ModalBody>
            <ModalFoot>
              <Button type="button" $variant="ghost" onClick={crud.close}>Bekor qilish</Button>
              <Button type="submit" disabled={!crud.form.company.trim()}>{crud.editId ? 'Saqlash' : "Qo'shish"}</Button>
            </ModalFoot>
          </Modal>
        </Overlay>
      )}

      {crud.deleteId && (
        <Overlay onMouseDown={() => crud.setDeleteId(null)}>
          <Modal $w="400px" onMouseDown={(e) => e.stopPropagation()}>
            <ConfirmBox>
              <div><Trash2 /></div>
              <h2>Brokerni o'chirasizmi?</h2>
              <p>Broker ro'yxatdan o'chiriladi, yuklar tarixi saqlanib qoladi.</p>
            </ConfirmBox>
            <ModalFoot style={{ borderTop: 'none', justifyContent: 'center' }}>
              <Button $variant="ghost" onClick={() => crud.setDeleteId(null)}>Bekor qilish</Button>
              <Button $variant="danger" onClick={() => { remove('brokers', crud.deleteId); crud.setDeleteId(null); }}>O'chirish</Button>
            </ModalFoot>
          </Modal>
        </Overlay>
      )}
    </Page>
  );
}
