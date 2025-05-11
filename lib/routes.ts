import { BookOpenCheck, ShoppingCart, Users } from "lucide-react"

export const routes = {
  home: "/",
  signin: "/auth/signin",
  clients: '/clients',
  orders: '/orders',
  products: '/products',
}

export const platformRoutes = [{
  id: 1,
  groupLabel: "Clientes",
  href: routes.clients,
  icon: Users
},{
  id: 2,
  groupLabel: "Pedidos",
  href: routes.orders,
  icon: BookOpenCheck,
},{
  id: 3,
  groupLabel: "Produtos",
  href: routes.products,
  icon: ShoppingCart
}]

export const authroutes = [
  routes.signin,
]

export const privateRoutes = [
  routes.clients,
  routes.orders,
  routes.products,
]