import type {FC, ReactNode} from 'react';
import {twMerge} from 'tailwind-merge';
import Footer from '~/components/Footer';
import Header from '~/components/Header';

interface LayoutProps {
  children: ReactNode;
  className?: string;
}

const Layout: FC<LayoutProps> = ({children, className}) => (
  <div className={twMerge('flex h-dvh flex-col', className)}>
    <Header className="flex-none" />
    <main className="flex-1">{children}</main>
    <Footer className="flex-none" />
  </div>
);

export default Layout;
