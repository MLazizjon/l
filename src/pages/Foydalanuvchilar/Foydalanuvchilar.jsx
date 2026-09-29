import { useState } from 'react';
import { Plus, Pencil, Trash2, X, ShieldCheck, UserRound, RotateCcw } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import useCrud from '../../hooks/useCrud';
import { ROLES } from '../../data/constants';
import { initials } from '../../utils/helpers';
import {
  Page, PageHead, PageTitle, PageSub, Button, IconButton, Card, TableWrap, Table, Actions,
  Person, Avatar, Muted, Overlay, Modal, ModalHead, ModalBody, ModalFoot, FormGrid, Field, Input,
  FormSelect, ConfirmBox,
} from '../../styles/ui';
import { RoleTag, You, Hint, Danger } from './styles';

const EMPTY = { name: '', username: '', password: '', role: 'user' };

export default function Foydalanuvchilar() {
  const { users, create, update, remove, resetData } = useData();
  const { user: me } = useAuth();
  const crud = useCrud(EMPTY);
  const [error, setError] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);

  const adminCount = users.filter((u) => u.role === 'admin').length;

  const onSave = (e) => {
    e.preventDefault();
    const { name, username, password, role } = crud.form;
    const taken = users.some(
      (u) => u.username.toLowerCase() === username.trim().toLowerCase() && u.id !== crud.editId
    );
    if (taken) return setError('Bu login band. Boshqa login tanlang.');
    const editing = users.find((u) => u.id === crud.editId);
    if (editing?.role === 'admin' && role !== 'admin' && adminCount === 1) {
      return setError("Tizimda kamida bitta administrator qolishi kerak.");
    }
    const payload = { name: name.trim(), username: username.trim(), password, role };
    if (crud.editId) update('users', crud.editId, payload);
    else create('users', payload);
    crud.close();
  };

  const canDelete = (u) => u.id !== me.id && !(u.role === 'admin' && adminCount === 1);

  const open = (fn) => (arg) => { setError(''); fn(arg); };

  return (
    <Page>
      <PageHead>
        <div>
          <PageTitle>Foydalanuvchilar</PageTitle>
          <PageSub>Tizimga kira oladigan xodimlar. Admin hamma narsani tahrirlaydi, user faqat ko'radi.</PageSub>
        </div>
        <Button onClick={open(crud.openCreate)}><Plus /> Foydalanuvchi qo'shish</Button>
      </PageHead>

      <Card $pad={false}>
        <TableWrap>
          <Table $min="680px">
            <thead>
              <tr><th>Xodim</th><th>Login</th><th>Rol</th><th>Huquqlar</th><th /></tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>
                    <Person>
                      <Avatar $dark={u.role === 'admin'}>{initials(u.name)}</Avatar>
                      <div>
                        <strong>{u.name} {u.id === me.id && <You>Siz</You>}</strong>
                      </div>
                    </Person>
                  </td>
                  <td><Muted>@{u.username}</Muted></td>
                  <td>
                    <RoleTag $admin={u.role === 'admin'}>
                      {u.role === 'admin' ? <ShieldCheck /> : <UserRound />}
                      {ROLES.find((r) => r.value === u.role)?.label}
                    </RoleTag>
                  </td>
                  <td><Muted>{u.role === 'admin' ? "Ko'rish, qo'shish, tahrirlash, o'chirish, hisobot" : "Faqat ko'rish"}</Muted></td>
                  <td>
                    <Actions>
                      <IconButton onClick={() => open(crud.openEdit)(u)} aria-label="Tahrirlash"><Pencil /></IconButton>
                      <IconButton
                        $danger
                        disabled={!canDelete(u)}
                        style={{ opacity: canDelete(u) ? 1 : 0.35 }}
                        title={canDelete(u) ? "O'chirish" : "Bu foydalanuvchini o'chirib bo'lmaydi"}
                        onClick={() => canDelete(u) && crud.setDeleteId(u.id)}
                        aria-label="O'chirish"
                      >
                        <Trash2 />
                      </IconButton>
                    </Actions>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableWrap>
      </Card>

      <Danger>
        <div>
          <h3>Demo ma'lumotlarni tiklash</h3>
          <p>Barcha yuk, haydovchi, broker va foydalanuvchilar boshlang'ich holatiga qaytadi.</p>
        </div>
        <Button $variant="ghost" onClick={() => setConfirmReset(true)}><RotateCcw /> Tiklash</Button>
      </Danger>

      {crud.open && (
        <Overlay onMouseDown={crud.close}>
          <Modal as="form" $w="500px" onSubmit={onSave} onMouseDown={(e) => e.stopPropagation()}>
            <ModalHead>
              <div>
                <h2>{crud.editId ? 'Foydalanuvchini tahrirlash' : 'Yangi foydalanuvchi'}</h2>
                <p>Kirish ma'lumotlari va rol</p>
              </div>
              <IconButton type="button" onClick={crud.close} aria-label="Yopish"><X /></IconButton>
            </ModalHead>
            <ModalBody>
              <FormGrid>
                <Field $full><span>F.I.Sh.</span>
                  <Input name="name" value={crud.form.name} onChange={crud.onChange} required />
                </Field>
                <Field><span>Login</span>
                  <Input name="username" value={crud.form.username} onChange={(e) => { setError(''); crud.onChange(e); }} required />
                </Field>
                <Field><span>Parol</span>
                  <Input name="password" value={crud.form.password} onChange={crud.onChange} required />
                </Field>
                <Field $full><span>Rol</span>
                  <FormSelect name="role" value={crud.form.role} onChange={(e) => { setError(''); crud.onChange(e); }}>
                    {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                  </FormSelect>
                </Field>
              </FormGrid>
              {error && <Hint $error>{error}</Hint>}
              {!error && <Hint>Demo rejimda parollar brauzerda ochiq saqlanadi. Real loyihada backend orqali xeshlab saqlang.</Hint>}
            </ModalBody>
            <ModalFoot>
              <Button type="button" $variant="ghost" onClick={crud.close}>Bekor qilish</Button>
              <Button type="submit" disabled={!crud.form.name.trim() || !crud.form.username.trim() || !crud.form.password}>
                {crud.editId ? 'Saqlash' : "Qo'shish"}
              </Button>
            </ModalFoot>
          </Modal>
        </Overlay>
      )}

      {crud.deleteId && (
        <Overlay onMouseDown={() => crud.setDeleteId(null)}>
          <Modal $w="400px" onMouseDown={(e) => e.stopPropagation()}>
            <ConfirmBox>
              <div><Trash2 /></div>
              <h2>Foydalanuvchini o'chirasizmi?</h2>
              <p>U endi tizimga kira olmaydi.</p>
            </ConfirmBox>
            <ModalFoot style={{ borderTop: 'none', justifyContent: 'center' }}>
              <Button $variant="ghost" onClick={() => crud.setDeleteId(null)}>Bekor qilish</Button>
              <Button $variant="danger" onClick={() => { remove('users', crud.deleteId); crud.setDeleteId(null); }}>O'chirish</Button>
            </ModalFoot>
          </Modal>
        </Overlay>
      )}

      {confirmReset && (
        <Overlay onMouseDown={() => setConfirmReset(false)}>
          <Modal $w="420px" onMouseDown={(e) => e.stopPropagation()}>
            <ConfirmBox>
              <div><RotateCcw /></div>
              <h2>Ma'lumotlarni tiklaysizmi?</h2>
              <p>Siz kiritgan barcha o'zgarishlar o'chadi.</p>
            </ConfirmBox>
            <ModalFoot style={{ borderTop: 'none', justifyContent: 'center' }}>
              <Button $variant="ghost" onClick={() => setConfirmReset(false)}>Bekor qilish</Button>
              <Button $variant="danger" onClick={() => { resetData(); setConfirmReset(false); }}>Tiklash</Button>
            </ModalFoot>
          </Modal>
        </Overlay>
      )}
    </Page>
  );
}
