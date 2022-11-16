
import Link from 'next/link';

export default ({ currentUser }) => {
  const links = [
    !currentUser && { label: 'Sign Up', href: '/auth/signup' }, //if currentUser not true meaning not logged in then show signup
    !currentUser && { label: 'Sign In', href: '/auth/signin' }, //if currentUser not true meaning not logged in then show signin as well
    currentUser && { label: 'Sell Tickets', href: '/tickets/new' },
    currentUser && { label: 'My Orders', href: '/orders' },
    currentUser && { label: 'Sign Out', href: '/auth/signout' }// but if its true means logged in so show up sign out
  ].filter(linkConfig => linkConfig) //filterout any entries that are false
    .map(({ label, href }) => { // remaining entries those are true map through them
      return (
        <li key={href} className="nav-item">
          <Link legacyBehavior href={href}>
            <a className="nav-link">{label}</a>
          </Link>
        </li>
      );
    });

  return (
    <nav className="navbar navbar-light bg-light">
      <Link legacyBehavior href="/">
        <a className="navbar-brand">GitTix</a>
      </Link>

      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">{links}</ul>
      </div>
    </nav>
  );
};
