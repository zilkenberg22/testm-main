export default function Custom404({ statusCode }) {
  return (
    <div>
      <h1>{statusCode} - Page Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
    </div>
  );
}
