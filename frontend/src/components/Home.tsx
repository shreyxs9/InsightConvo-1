import Nav from "./nav";

function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-500">
      <Nav />
      <h1 className="text-4xl text-black dark:text-white">Home Screen</h1>
    </div>
  );
}

export default Home;
