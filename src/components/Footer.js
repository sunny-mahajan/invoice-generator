const Footer = () => {
  const currentYear = new Date().getFullYear(); // Get the current year

  return (
    <footer className="d-flex justify-center py-4 footer mt-4">
      <p className="text-center text-sm md:text-base">
        © {currentYear} www.techformation.co.in pvt ltd. All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;
