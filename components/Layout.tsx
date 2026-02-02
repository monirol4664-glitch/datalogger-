import React from 'react';
import Header from './Header';

const Layout: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  return (
    <div>
      <Header />
      <main>{children}</main>
      <footer className="mt-20 py-8 border-t bg-white">
        <div className="container text-sm text-slate-500">Built with ❤️ — deploy on Vercel</div>
      </footer>
    </div>
  );
};

export default Layout;
