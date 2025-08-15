// src/pages/admin/menu.tsx

import AdminLayout from '../../components/admin/AdminLayout';
import MenuForm from '../../components/admin/MenuForm';
import { getSession } from 'next-auth/react';
import { GetServerSideProps } from 'next';

export default function AdminMenuPage() {
  return (
    <AdminLayout>
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-4">Gerenciar Menu</h1>
        <MenuForm />
      </div>
    </AdminLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  // --- ADICIONE ESTA LINHA PARA DEPURAR ---
  console.log('Sessão recebida no servidor:', session);

  if (!session || session.user?.role !== 'ADMIN') {
    return {
      redirect: {
        destination: '/api/auth/signin',
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
};