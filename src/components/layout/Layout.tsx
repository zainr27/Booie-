
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import PageTransition from './PageTransition';
import { ApplyCTA } from '@/components/shared';
import DisclosureFooter from '@/components/shared/DisclosureFooter';

interface LayoutProps {
  children: React.ReactNode;
  hideApplyCTA?: boolean;
  hideDisclosure?: boolean;
}

const Layout = ({ children, hideApplyCTA = false, hideDisclosure = false }: LayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <PageTransition>
        <main className="flex-grow">
          {children}
          
          <div className="container-custom pb-12">
            {!hideDisclosure && <DisclosureFooter className="my-8" />}
            {!hideApplyCTA && <ApplyCTA />}
          </div>
        </main>
      </PageTransition>
      <Footer />
    </div>
  );
};

export default Layout;
