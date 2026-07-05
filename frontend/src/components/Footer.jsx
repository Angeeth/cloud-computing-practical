function Footer() {
  return (
    <footer className="bg-[#0b0f19] border-t border-slate-900/60 py-6 mt-auto">
      <p className="text-center text-slate-500 text-sm">
        © {new Date().getFullYear()} Ecommerce. All Rights Reserved.
      </p>
    </footer>
  );
}

export default Footer;