import { useMemo, useState } from 'react';
import { Plus, Search as SearchIcon, Pencil, Trash2, X, Factory, MapPin } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import useCrud from '../../hooks/useCrud';
import { CITIES, FACTORY_STATUS, toneOf } from '../../data/constants';
import { matches, fmtNumber } from '../../utils/helpers';
import {
  Page, PageHead, PageTitle, PageSub, Button, IconButton, Card, Chips, Chip, Toolbar, Search,
  TableWrap, Table, Badge, Actions, Empty, Person, Avatar, Muted, Overlay, Modal, ModalHead,
  ModalBody, ModalFoot, FormGrid, Field, Input, FormSelect, ConfirmBox,
} from '../../styles/ui';
import { City, Volume } from './styles';

const EMPTY = { name: '', city: 'Samarqand', product: '', contact: '', phone: '+998 ', status: 'Hamkor' };

export default function Zavodlar() {
  const { factories, cargo, create, update, remove } = useData();
  const { isAdmin } = useAuth();
  const crud = useCrud(EMPTY);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('Barchasi');

  const volume = useMemo(() => {
    const map = {};
    cargo.forEach((c) => {
      if (!c.factoryId || c.status === 'Bekor qilindi') return;
      map[c.factoryId] = map[c.factoryId] || { count: 0, tons: 0 };
      map[c.factoryId].count += 1;
      map[c.factoryId].tons += Number(c.weight) || 0;
    });
    return map;
  }, [cargo]);

  const rows = factories
    .filter((f) => status === 'Barchasi' || f.status === status)
    .filter((f) => matches(f, query, ['name', 'city', 'product', 'contact']));

  const onSave = (e) => {
    e.preventDefault();
    const payload = { ...crud.form };
    delete payload.id;
    if (crud.editId) update('factories', crud.editId, payload);
    else create('factories', payload);
    crud.close();
  };

  return (
    <Page>
      <PageHead>
        <div>
          <PageTitle>Zavodlar</PageTitle>
          <PageSub>Yuk jo'natuvchi korxonalar va ular bilan ishlash holati.</PageSub>
        </div>
        {isAdmin && <Button onClick={crud.openCreate}><Plus /> Zavod qo'shish</Button>}
      </PageHead>

      <Chips>
        {['Barchasi', ...FACTORY_STATUS].map((s) => (
          <Chip key={s} $active={status === s} onClick={() => setStatus(s)}>
            {s} <b>{s === 'Barchasi' ? factories.length : factories.filter((f) => f.status === s).length}</b>
          </Chip>
        ))}
      </Chips>

      <Card $pad={false}>
        <Toolbar>
          <Search>
            <SearchIcon />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Zavod, shahar yoki mahsulot" />
          </Search>
        </Toolbar>

        {rows.length ? (
          <TableWrap>
            <Table $min="920px">
              <thead>
                <tr>
                  <th>Zavod</th>
                  <th>Shahar</th>
                  <th>Mas'ul shaxs</th>
                  <th>Jo'natilgan</th>
                  <th>Holat</th>
                  {isAdmin && <th />}
                </tr>
              </thead>
              <tbody>
                {rows.map((f) => {
                  const v = volume[f.id] || { count: 0, tons: 0 };
                  return (
                    <tr key={f.id}>
                      <td>
                        <Person>
                          <Avatar $square><Factory /></Avatar>
                          <div>
                            <strong>{f.name}</strong>
                            <small>{f.product}</small>
                          </div>
                        </Person>
                      </td>
                      <td><City><MapPin />{f.city}</City></td>
                      <td>
                        <div>{f.contact || '—'}</div>
                        <Muted>{f.phone}</Muted>
                      </td>
                      <td>
                        <Volume>
                          <b>{fmtNumber(v.tons)} t</b>
                          <span>{v.count} ta yuk</span>
                        </Volume>
                      </td>
                      <td><Badge $tone={toneOf(f.status)}>{f.status}</Badge></td>
                      {isAdmin && (
                        <td>
                          <Actions>
                            <IconButton onClick={() => crud.openEdit(f)} aria-label="Tahrirlash"><Pencil /></IconButton>
                            <IconButton $danger onClick={() => crud.setDeleteId(f.id)} aria-label="O'chirish"><Trash2 /></IconButton>
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
            <Factory />
            <h4>Zavod topilmadi</h4>
            <p>Qidiruvni o'zgartiring yoki yangi zavod qo'shing.</p>
          </Empty>
        )}
      </Card>

      {crud.open && (
        <Overlay onMouseDown={crud.close}>
          <Modal as="form" onSubmit={onSave} onMouseDown={(e) => e.stopPropagation()}>
            <ModalHead>
              <div>
                <h2>{crud.editId ? 'Zavodni tahrirlash' : 'Yangi zavod'}</h2>
                <p>Korxona va aloqa ma'lumotlari</p>
              </div>
              <IconButton type="button" onClick={crud.close} aria-label="Yopish"><X /></IconButton>
            </ModalHead>
            <ModalBody>
              <FormGrid>
                <Field $full><span>Zavod nomi</span>
                  <Input name="name" value={crud.form.name} onChange={crud.onChange} placeholder="Zarafshon Sement" required />
                </Field>
                <Field><span>Shahar</span>
                  <FormSelect name="city" value={crud.form.city} onChange={crud.onChange}>
                    {CITIES.map((c) => <option key={c}>{c}</option>)}
                  </FormSelect>
                </Field>
                <Field><span>Mahsulot</span>
                  <Input name="product" value={crud.form.product} onChange={crud.onChange} placeholder="Sement, un..." />
                </Field>
                <Field><span>Mas'ul shaxs</span>
                  <Input name="contact" value={crud.form.contact} onChange={crud.onChange} />
                </Field>
                <Field><span>Telefon</span>
                  <Input name="phone" value={crud.form.phone} onChange={crud.onChange} />
                </Field>
                <Field $full><span>Holat</span>
                  <FormSelect name="status" value={crud.form.status} onChange={crud.onChange}>
                    {FACTORY_STATUS.map((s) => <option key={s}>{s}</option>)}
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
              <h2>Zavodni o'chirasizmi?</h2>
              <p>Zavod ro'yxatdan o'chiriladi.</p>
            </ConfirmBox>
            <ModalFoot style={{ borderTop: 'none', justifyContent: 'center' }}>
              <Button $variant="ghost" onClick={() => crud.setDeleteId(null)}>Bekor qilish</Button>
              <Button $variant="danger" onClick={() => { remove('factories', crud.deleteId); crud.setDeleteId(null); }}>O'chirish</Button>
            </ModalFoot>
          </Modal>
        </Overlay>
      )}
    </Page>
  );
}
