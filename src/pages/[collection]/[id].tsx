import Home from "../index";

export default function ProductPage() {
  // Só reusa o componente Home, que já lida com modal via router.query
  return <Home />;
}