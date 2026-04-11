import NotFoundPage from '@/components/not-found/NotFoundPage';

export const metadata = {
  title: 'Error 404. Lost in Space. | Creative Moon',
  description: 'The page you\'re looking for doesn\'t exist.',
};

export default function NotFound() {
  return (
    <main>
      <NotFoundPage />
    </main>
  );
}
