import { useMemo, useState } from 'react';
import { Plus, Search as SearchIcon, Pencil, Trash2, X, Truck } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import useCrud from '../../hooks/useCrud';
import { CITIES, DRIVER_STATUS, toneOf } from '../../data/constants';
import { initials, matches } from '../../utils/helpers';
import {
  Page, PageHead, PageTitle, PageSub, Button, IconButton, Card, Chips, Chip, Toolbar, Search,
  Select, TableWrap, Table, Badge, Actions, Empty, Person, Avatar, Muted, Overlay, Modal,
  ModalHead, ModalBody, ModalFoot, FormGrid, Field, Input, FormSelect, ConfirmBox,
} from '../../styles/ui';
import { Plate, TruckCell, TripCount } from './styles';

const EMPTY = { name: '', phone: '+998 ', truck: '', plate: '', city: 'Samarqand', experience: '', status: 'Faol' };

export default function Haydovchilar() {
  const { drivers, cargo, create, update, remove } = useData();
  const { isAdmin } = useAuth();
  const crud = useCrud(EMPTY);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('Barchasi');
  const [city, setCity] = useState('');

  const trips = useMemo(() => {
    const map = {};
    cargo.forEach((c) => { if (c.driverId) map[c.driverId] = (map[c.driverId] || 0) + 1; });
    return map;
  }, [cargo]);

  const counts = useMemo(() => {
    const c = { Barchasi: drivers.length };
    DRIVER_STATUS.forEach((s) => (c[s] = drivers.filter((d) => d.status === s).length));
    return c;
  }, [drivers]);

  const rows = drivers
    .filter((d) => status === 'Barchasi' || d.status === status)
    .filter((d) => !city || d.city === city)
    .filter((d) => matches(d, query, ['name', 'phone', 'plate', 'truck']));

  const onSave = (e) => {
    e.preventDefault();
    const payload = { ...crud.form };
    delete payload.id;
    if (crud.editId) update('drivers', crud.editId, payload);
    else create('drivers', payload);
    crud.close();
  };

  return (
    <Page>
      <PageHead>
        <div>
          <PageTitle>Haydovchilar</PageTitle>
          <PageSub>Haydovchilar, ularning mashinalari va hozirgi holati.</PageSub>
        </div>
        {isAdmin && <Button onClick={crud.openCreate}><Plus /> Haydovchi qo'shish</Button>}
      </PageHead>

      <Chips>
        {['Barchasi', ...DRIVER_STATUS].map((s) => (
          <Chip key={s} $active={status === s} onClick={() => setStatus(s)}>
            {s} <b>{counts[s]}</b>
          </Chip>
        ))}
      </Chips>

      <Card $pad={false}>
        <Toolbar>
          <Search>
            <SearchIcon />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Ism, telefon yoki davlat raqami" />
          </Search>
          <Select value={city} onChange={(e) => setCity(e.target.value)}>
            <option value="">Barcha shaharlar</option>
            {CITIES.map((c) => <option key={c}>{c}</option>)}
          </Select>
        </Toolbar>

        {rows.length ? (
          <TableWrap>
            <Table $min="900px">
              <thead>
                <tr>
                  <th>Haydovchi</th>
                  <th>Mashina</th>
                  <th>Shahar</th>
                  <th>Tajriba</th>
                  <th>Reyslar</th>
                  <th>Holat</th>
                  {isAdmin && <th />}
                </tr>
              </thead>
              <tbody>
                {rows.map((d) => (
                  <tr key={d.id}>
                    <td>
                      <Person>
                        <Avatar>{initials(d.name)}</Avatar>
                        <div>
                          <strong>{d.name}</strong>
                          <small><a href={`tel:${d.phone.replace(/\s/g, '')}`}>{d.phone}</a></small>
                        </div>
                      </Person>
                    </td>
                    <td>
                      <TruckCell>
                        <Plate><em>UZ</em>{d.plate || '—'}</Plate>
                        <small>{d.truck}</small>
                      </TruckCell>
                    </td>
                    <td>{d.city}</td>
                    <td><Muted>{d.experience ? `${d.experience} yil` : '—'}</Muted></td>
                    <td><TripCount>{trips[d.id] || 0}</TripCount></td>
                    <td><Badge $tone={toneOf(d.status)}>{d.status}</Badge></td>
                    {isAdmin && (
                      <td>
                        <Actions>
                          <IconButton onClick={() => crud.openEdit(d)} aria-label="Tahrirlash"><Pencil /></IconButton>
                          <IconButton $danger onClick={() => crud.setDeleteId(d.id)} aria-label="O'chirish"><Trash2 /></IconButton>
                        </Actions>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableWrap>
        ) : (
          <Empty>
            <Truck />
            <h4>Haydovchi topilmadi</h4>
            <p>Filtrlarni tozalang yoki yangi haydovchi qo'shing.</p>
          </Empty>
        )}
      </Card>

      {crud.open && (
        <Overlay onMouseDown={crud.close}>
          <Modal as="form" onSubmit={onSave} onMouseDown={(e) => e.stopPropagation()}>
            <ModalHead>
              <div>
                <h2>{crud.editId ? 'Haydovchini tahrirlash' : 'Yangi haydovchi'}</h2>
                <p>Shaxsiy ma'lumot va mashina</p>
              </div>
              <IconButton type="button" onClick={crud.close} aria-label="Yopish"><X /></IconButton>
            </ModalHead>
            <ModalBody>
              <FormGrid>
                <Field $full><span>F.I.Sh.</span>
                  <Input name="name" value={crud.form.name} onChange={crud.onChange} placeholder="Jasur Rahimov" required />
                </Field>
                <Field><span>Telefon</span>
                  <Input name="phone" value={crud.form.phone} onChange={crud.onChange} placeholder="+998 90 123 45 67" />
                </Field>
                <Field><span>Shahar</span>
                  <FormSelect name="city" value={crud.form.city} onChange={crud.onChange}>
                    {CITIES.map((c) => <option key={c}>{c}</option>)}
                  </FormSelect>
                </Field>
                <Field><span>Mashina rusumi</span>
                  <Input name="truck" value={crud.form.truck} onChange={crud.onChange} placeholder="MAN TGX" />
                </Field>
                <Field><span>Davlat raqami</span>
                  <Input name="plate" value={crud.form.plate} onChange={crud.onChange} placeholder="30 A 123 BA" />
                </Field>
                <Field><span>Tajriba (yil)</span>
                  <Input name="experience" type="number" min="0" value={crud.form.experience} onChange={crud.onChange} />
                </Field>
                <Field><span>Holat</span>
                  <FormSelect name="status" value={crud.form.status} onChange={crud.onChange}>
                    {DRIVER_STATUS.map((s) => <option key={s}>{s}</option>)}
                  </FormSelect>
                </Field>
              </FormGrid>
            </ModalBody>
            <ModalFoot>
              <Button type="button" $variant="ghost" onClick={crud.close}>Bekor qilish</Button>
              <Button type="submit" disabled={!crud.form.name.trim()}>{crud.editId ? 'Saqlash' : "Qo'shish"}</Button>
            </ModalFoot>
          </Modal>
        </Overlay>
      )}

      {crud.deleteId && (
        <Overlay onMouseDown={() => crud.setDeleteId(null)}>
          <Modal $w="400px" onMouseDown={(e) => e.stopPropagation()}>
            <ConfirmBox>
              <div><Trash2 /></div>
              <h2>Haydovchini o'chirasizmi?</h2>
              <p>Unga biriktirilgan yuklar "Biriktirilmagan" bo'lib qoladi.</p>
            </ConfirmBox>
            <ModalFoot style={{ borderTop: 'none', justifyContent: 'center' }}>
              <Button $variant="ghost" onClick={() => crud.setDeleteId(null)}>Bekor qilish</Button>
              <Button $variant="danger" onClick={() => { remove('drivers', crud.deleteId); crud.setDeleteId(null); }}>O'chirish</Button>
            </ModalFoot>
          </Modal>
        </Overlay>
      )}
    </Page>
  );
}

