import { describe, it, expect, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import Header from '@/components/Header';
import USPSection from '@/components/USPSection';
import ProductCard from '@/components/ProductCard';
import Footer from '@/components/Footer';
import i18n from '@/i18n';
import { MusicProvider } from '@/contexts/MusicContext';

// Wrapper that provides all required contexts
function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <MusicProvider>
      {children}
    </MusicProvider>
  );
}

// Ensure Czech is active for tests
beforeAll(async () => {
  await i18n.changeLanguage('cs');
});

describe('Amulets.cz Components', () => {
  describe('Header', () => {
    it('should render logo', () => {
      render(<Header />, { wrapper: TestWrapper });
      const logo = screen.getByAltText('Amulets');
      expect(logo).toBeDefined();
    });

    it('should render search input', () => {
      render(<Header />, { wrapper: TestWrapper });
      const searchInput = screen.getByPlaceholderText(i18n.t('header.search'));
      expect(searchInput).toBeDefined();
    });

    it('should render contact phone number', () => {
      render(<Header />, { wrapper: TestWrapper });
      const phone = screen.getByText(/776 041 740/i);
      expect(phone).toBeDefined();
    });

    it('should render navigation items', () => {
      render(<Header />, { wrapper: TestWrapper });
      expect(screen.getByText(i18n.t('nav.pyramids'))).toBeDefined();
      expect(screen.getByText(i18n.t('nav.aromatherapy'))).toBeDefined();
      expect(screen.getByText(i18n.t('nav.contact'))).toBeDefined();
    });
  });

  describe('USPSection', () => {
    it('should render all 4 USP boxes', () => {
      render(<USPSection />, { wrapper: TestWrapper });
      expect(screen.getAllByText(new RegExp(i18n.t('usp.delivery.title'), 'i')).length).toBeGreaterThan(0);
      expect(screen.getAllByText(new RegExp(i18n.t('usp.handmade.title'), 'i')).length).toBeGreaterThan(0);
      expect(screen.getAllByText(new RegExp(i18n.t('usp.handcraft.title'), 'i')).length).toBeGreaterThan(0);
      expect(screen.getAllByText(new RegExp(i18n.t('usp.gift.title'), 'i')).length).toBeGreaterThan(0);
    });
  });

  describe('ProductCard', () => {
    it('should render product name and price', () => {
      render(
        <ProductCard
          name="Pyramida OHORAI ~ Hojnost"
          price="8 800 Kč"
          available={true}
        />,
        { wrapper: TestWrapper }
      );
      expect(screen.getByText('Pyramida OHORAI ~ Hojnost')).toBeDefined();
      expect(screen.getByText('8 800 Kč')).toBeDefined();
    });

    it('should show availability badge when available', () => {
      render(
        <ProductCard
          name="Test Product"
          price="1 000 Kč"
          available={true}
        />,
        { wrapper: TestWrapper }
      );
      // Badge text varies - use getAllByText and check at least one exists
      const badges = screen.getAllByText(/Pouze|Limitovaná|Poslední|Only|Limited|Last/i);
      expect(badges.length).toBeGreaterThan(0);
    });

    it('should show sold out when not available', () => {
      render(
        <ProductCard
          name="Test Product"
          price="1 000 Kč"
          available={false}
        />,
        { wrapper: TestWrapper }
      );
      expect(screen.getByText(i18n.t('products.soldOut'))).toBeDefined();
    });
  });

  describe('Footer', () => {
    it('should render contact information', () => {
      render(<Footer />, { wrapper: TestWrapper });
      expect(screen.getByText(/776 041 740/i)).toBeDefined();
      expect(screen.getByText('info@amulets.cz')).toBeDefined();
    });

    it('should render copyright', () => {
      render(<Footer />, { wrapper: TestWrapper });
      expect(screen.getByText(i18n.t('footer.copyright'))).toBeDefined();
    });

    it('should render footer links', () => {
      render(<Footer />, { wrapper: TestWrapper });
      expect(screen.getByText(i18n.t('footer.shipping'))).toBeDefined();
      expect(screen.getByText(i18n.t('footer.terms'))).toBeDefined();
    });
  });
});
