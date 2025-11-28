import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import USPSection from '@/components/USPSection';
import ProductCard from '@/components/ProductCard';
import Footer from '@/components/Footer';

describe('Amulets.cz Components', () => {
  describe('Header', () => {
    it('should render logo', () => {
      render(<Header />);
      const logo = screen.getByAltText('Amulets');
      expect(logo).toBeDefined();
    });

    it('should render search input', () => {
      render(<Header />);
      const searchInput = screen.getByPlaceholderText(/Co hledáte/i);
      expect(searchInput).toBeDefined();
    });

    it('should render contact phone number', () => {
      render(<Header />);
      const phone = screen.getByText(/776 041 740/i);
      expect(phone).toBeDefined();
    });

    it('should render navigation items', () => {
      render(<Header />);
      expect(screen.getByText('Orgonitové pyramidy')).toBeDefined();
      expect(screen.getByText('Aromaterapie')).toBeDefined();
      expect(screen.getByText('Kontakt')).toBeDefined();
    });
  });

  describe('HeroSection', () => {
    it('should render main heading', () => {
      render(<HeroSection />);
      const heading = screen.getByText(/Otevřete své/i);
      expect(heading).toBeDefined();
    });

    it('should render CTA button', () => {
      render(<HeroSection />);
      const button = screen.getByText('ZÍSKAT VÍCE');
      expect(button).toBeDefined();
    });

    it('should render hero image', () => {
      render(<HeroSection />);
      const img = screen.getByAltText(/Natálie Ohorai/i);
      expect(img).toBeDefined();
    });
  });

  describe('USPSection', () => {
    it('should render all 4 USP boxes', () => {
      render(<USPSection />);
      expect(screen.getAllByText(/Doprava zdarma od 1 500 Kč/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Úprava amuletů na míru/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Ruční výroba/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Dárek pro každého/i).length).toBeGreaterThan(0);
    });
  });

  describe('ProductCard', () => {
    it('should render product name and price', () => {
      render(
        <ProductCard
          name="Pyramida OHORAI ~ Hojnost"
          price="8 800 Kč"
          available={true}
        />
      );
      expect(screen.getByText('Pyramida OHORAI ~ Hojnost')).toBeDefined();
      expect(screen.getByText('8 800 Kč')).toBeDefined();
    });

    it('should show "Skladem" badge when available', () => {
      render(
        <ProductCard
          name="Test Product"
          price="1 000 Kč"
          available={true}
        />
      );
      expect(screen.getByText('Skladem')).toBeDefined();
    });

    it('should show "Vyprodáno" when not available', () => {
      render(
        <ProductCard
          name="Test Product"
          price="1 000 Kč"
          available={false}
        />
      );
      expect(screen.getByText('Vyprodáno')).toBeDefined();
    });
  });

  describe('Footer', () => {
    it('should render contact information', () => {
      render(<Footer />);
      expect(screen.getByText(/776 041 740/i)).toBeDefined();
      expect(screen.getByText('info@amulets.cz')).toBeDefined();
    });

    it('should render copyright', () => {
      render(<Footer />);
      expect(screen.getByText(/2020 - 2025 © Amulets.cz/i)).toBeDefined();
    });

    it('should render footer links', () => {
      render(<Footer />);
      expect(screen.getByText('Doprava a platba')).toBeDefined();
      expect(screen.getByText('Obchodní podmínky')).toBeDefined();
    });
  });
});
