import { useMemo, useState } from 'react';
import { Plus, Search as SearchIcon, Pencil, Trash2, X, PackageOpen, Download } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import useCrud from '../../hooks/useCrud';
import { CARGO_STATUS, CITIES, toneOf } from '../../data/constants';
import { money, fmtDate, matches, today, downloadCSV } from '../../utils/helpers';
import {
  Page, PageHead, PageTitle, PageSub, Button, IconButton, Card, Chips, Chip, Toolbar, Search,
  Select, TableWrap, Table, Badge, Actions, Empty, Muted, Overlay, Modal, ModalHead, ModalBody,
  ModalFoot, FormGrid, Field, Input, FormSelect, ConfirmBox,
} from '../../styles/ui';
import { CargoCell, RouteCell, Weight, DriverTag } from './styles';

const EMPTY = {
  title: '', factoryId: '', from: 'Samarqand', to: 'Toshkent', weight: '', price: '',
  driverId: '', brokerId: '', status: 'Kutilmoqda', date: today(),
};

export default function Yuklar() {
  const { cargo, drivers, brokers, factories, create, update, remove } = useData();
  const { isAdmin } = useAuth();
  const crud = useCrud(EMPTY);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('Barchasi');
  const [brokerFilter, setBrokerFilter] = useState('');

  const byId = (list, id) => list.find((x) => x.id === id);

  const counts = useMemo(() => {
    const c = { Barchasi: cargo.length };
    CARGO_STATUS.forEach((s) => (c[s] = cargo.filter((x) => x.status === s).length));
    return c;
  }, [cargo]);

  const rows = useMemo(
    () =>
      cargo
        .filter((x) => status === 'Barchasi' || x.status === status)
        .filter((x) => !brokerFilter || x.brokerId === brokerFilter)
        .filter((x) => matches(x, query, ['title', 'from', 'to']))
        .sort((a, b) => b.date.localeCompare(a.date)),
    [cargo, status, brokerFilter, query]
  );

  const onSave = (e) => {
    e.preventDefault();
    const payload = { ...crud.form };
    delete payload.id;
    if (crud.editId) update('cargo', crud.editId, payload);
    else create('cargo', payload);
    crud.close();
  };

  const exportCSV = () =>
    downloadCSV('yuklar.csv', [
      ['Yuk', 'Zavod', 'Qayerdan', 'Qayerga', 'Tonna', 'Narx', 'Haydovchi', 'Broker', 'Sana', 'Status'],
      ...rows.map((r) => [
        r.title, byId(factories, r.factoryId)?.name, r.from, r.to, r.weight, r.price,
        byId(drivers, r.driverId)?.name, byId(brokers, r.brokerId)?.company, fmtDate(r.date), r.status,
      ]),
    ]);

  const valid = crud.form.title && crud.form.from && crud.form.to && crud.form.price;

  return (
    <Page>
      <PageHead>
        <div>
          <PageTitle>Yuklar</PageTitle>
          <PageSub>Barcha buyurtmalar: qayerdan olinadi, kim olib boradi va qaysi holatda.</PageSub>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Button $variant="ghost" onClick={exportCSV}><Download /> Eksport</Button>
          {isAdmin && <Button onClick={crud.openCreate}><Plus /> Yangi yuk</Button>}
        </div>
      </PageHead>

      <Chips>
        {['Barchasi', ...CARGO_STATUS].map((s) => (
          <Chip key={s} $active={status === s} onClick={() => setStatus(s)}>
            {s} <b>{counts[s]}</b>
          </Chip>
        ))}
      </Chips>

      <Card $pad={false}>
        <Toolbar>
          <Search>
            <SearchIcon />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Yuk nomi yoki shahar bo'yicha qidirish" />
          </Search>
          <Select value={brokerFilter} onChange={(e) => setBrokerFilter(e.target.value)}>
            <option value="">Barcha brokerlar</option>
            {brokers.map((b) => <option key={b.id} value={b.id}>{b.company}</option>)}
          </Select>
        </Toolbar>

        {rows.length ? (
          <TableWrap>
            <Table $min="1060px">
              <thead>
                <tr>
                  <th>Yuk</th>
                  <th>Yo'nalish</th>
                  <th>Og'irlik</th>
                  <th>Narx</th>
                  <th>Haydovchi</th>
                  <th>Broker</th>
                  <th>Sana</th>
                  <th>Holat</th>
                  {isAdmin && <th />}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const driver = byId(drivers, r.driverId);
                  return (
                    <tr key={r.id}>
                      <td>
                        <CargoCell>
                          <strong>{r.title}</strong>
                          <small>{byId(factories, r.factoryId)?.name || 'Zavod ko\u02BBrsatilmagan'}</small>
                        </CargoCell>
                      </td>
                      <td>
                        <RouteCell>
                          <span>{r.from}</span><i /><span>{r.to}</span>
                        </RouteCell>
                      </td>
                      <td><Weight>{r.weight} t</Weight></td>
                      <td><strong>{money(r.price)}</strong></td>
                      <td>
                        {driver ? <DriverTag>{driver.name}<small>{driver.plate}</small></DriverTag> : <Muted>Biriktirilmagan</Muted>}
                      </td>
                      <td>{byId(brokers, r.brokerId)?.company || <Muted>—</Muted>}</td>
                      <td><Muted>{fmtDate(r.date)}</Muted></td>
                      <td><Badge $tone={toneOf(r.status)}>{r.status}</Badge></td>
                      {isAdmin && (
                        <td>
                          <Actions>
                            <IconButton onClick={() => crud.openEdit(r)} aria-label="Tahrirlash"><Pencil /></IconButton>
                            <IconButton $danger onClick={() => crud.setDeleteId(r.id)} aria-label="O'chirish"><Trash2 /></IconButton>
                          </Actions>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </TableWrap>
        ) : (
          <Empty>
            <PackageOpen />
            <h4>Yuk topilmadi</h4>
            <p>Qidiruv so'zini yoki holat filtrini o'zgartirib ko'ring.</p>
          </Empty>
        )}
      </Card>

      {crud.open && (
        <Overlay onMouseDown={crud.close}>
          <Modal as="form" $w="640px" onSubmit={onSave} onMouseDown={(e) => e.stopPropagation()}>
            <ModalHead>
              <div>
                <h2>{crud.editId ? 'Yukni tahrirlash' : 'Yangi yuk'}</h2>
                <p>Yuk, yo'nalish va mas'ul shaxslarni kiriting</p>
              </div>
              <IconButton type="button" onClick={crud.close} aria-label="Yopish"><X /></IconButton>
            </ModalHead>
            <ModalBody>
              <FormGrid>
                <Field $full><span>Yuk nomi</span>
                  <Input name="title" value={crud.form.title} onChange={crud.onChange} placeholder="masalan, Sement M400" required />
                </Field>
                <Field><span>Qayerdan</span>
                  <FormSelect name="from" value={crud.form.from} onChange={crud.onChange}>
                    {CITIES.map((c) => <option key={c}>{c}</option>)}
                  </FormSelect>
                </Field>
                <Field><span>Qayerga</span>
                  <FormSelect name="to" value={crud.form.to} onChange={crud.onChange}>
                    {CITIES.map((c) => <option key={c}>{c}</option>)}
                  </FormSelect>
                </Field>
                <Field><span>Og'irlik (tonna)</span>
                  <Input name="weight" type="number" min="0" value={crud.form.weight} onChange={crud.onChange} placeholder="20" />
                </Field>
                <Field><span>Narx (so'm)</span>
                  <Input name="price" type="number" min="0" value={crud.form.price} onChange={crud.onChange} placeholder="5000000" required />
                </Field>
                <Field><span>Zavod</span>
                  <FormSelect name="factoryId" value={crud.form.factoryId} onChange={crud.onChange}>
                    <option value="">Tanlanmagan</option>
                    {factories.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
                  </FormSelect>
                </Field>
                <Field><span>Broker</span>
                  <FormSelect name="brokerId" value={crud.form.brokerId} onChange={crud.onChange}>
                    <option value="">Tanlanmagan</option>
                    {brokers.map((b) => <option key={b.id} value={b.id}>{b.company}</option>)}
                  </FormSelect>
                </Field>
                <Field><span>Haydovchi</span>
                  <FormSelect name="driverId" value={crud.form.driverId} onChange={crud.onChange}>
                    <option value="">Biriktirilmagan</option>
                    {drivers.map((d) => <option key={d.id} value={d.id}>{d.name} — {d.plate}</option>)}
                  </FormSelect>
                </Field>
                <Field><span>Sana</span>
                  <Input name="date" type="date" value={crud.form.date} onChange={crud.onChange} />
                </Field>
                <Field $full><span>Holat</span>
                  <FormSelect name="status" value={crud.form.status} onChange={crud.onChange}>
                    {CARGO_STATUS.map((s) => <option key={s}>{s}</option>)}
                  </FormSelect>
                </Field>
              </FormGrid>
            </ModalBody>
            <ModalFoot>
              <Button type="button" $variant="ghost" onClick={crud.close}>Bekor qilish</Button>
              <Button type="submit" disabled={!valid}>{crud.editId ? 'Saqlash' : "Qo'shish"}</Button>
            </ModalFoot>
          </Modal>
        </Overlay>
      )}

      {crud.deleteId && (
        <Overlay onMouseDown={() => crud.setDeleteId(null)}>
          <Modal $w="400px" onMouseDown={(e) => e.stopPropagation()}>
            <ConfirmBox>
              <div><Trash2 /></div>
              <h2>Yukni o'chirasizmi?</h2>
              <p>Bu yuk ro'yxatdan butunlay o'chiriladi.</p>
            </ConfirmBox>
            <ModalFoot style={{ borderTop: 'none', justifyContent: 'center' }}>
              <Button $variant="ghost" onClick={() => crud.setDeleteId(null)}>Bekor qilish</Button>
              <Button $variant="danger" onClick={() => { remove('cargo', crud.deleteId); crud.setDeleteId(null); }}>O'chirish</Button>
            </ModalFoot>
          </Modal>
        </Overlay>
      )}
    </Page>
  );
}
