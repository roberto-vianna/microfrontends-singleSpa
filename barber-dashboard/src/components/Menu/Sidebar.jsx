import {
  CalendarDaysIcon,
  ClipboardDocumentListIcon,
  UserIcon
} from "@heroicons/react/24/solid";
import SidebarItem from "./SidebarItem";

const menuItems = [
  { label: "Agendamentos", route: "/agendamentos", icon: CalendarDaysIcon },
  { label: "Gerenciar Serviços", route: "/gerenciar-servicos", icon: ClipboardDocumentListIcon },
  { label: "Perfil", route: "/perfil", icon: UserIcon },
];

const Sidebar = () => {
  return (
    <nav className="h-screen px-3 bg-background text-white shadow-inset-primary flex flex-col sticky top-0">
      <div class="flex items-center ml-4 pt-4">
        <div
          class="bg-gray-920 mr-2 border border-solid border-primary shadow-md shadow-yellow-500/50 p-1 rounded-full size-8 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor" class="size-5 text-primary">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="m7.848 8.25 1.536.887M7.848 8.25a3 3 0 1 1-5.196-3 3 3 0 0 1 5.196 3Zm1.536.887a2.165 2.165 0 0 1 1.083 1.839c.005.351.054.695.14 1.024M9.384 9.137l2.077 1.199M7.848 15.75l1.536-.887m-1.536.887a3 3 0 1 1-5.196 3 3 3 0 0 1 5.196-3Zm1.536-.887a2.165 2.165 0 0 0 1.083-1.838c.005-.352.054-.695.14-1.025m-1.223 2.863 2.077-1.199m0-3.328a4.323 4.323 0 0 1 2.068-1.379l5.325-1.628a4.5 4.5 0 0 1 2.48-.044l.803.215-7.794 4.5m-2.882-1.664A4.33 4.33 0 0 0 10.607 12m3.736 0 7.794 4.5-.802.215a4.5 4.5 0 0 1-2.48-.043l-5.326-1.629a4.324 4.324 0 0 1-2.068-1.379M14.343 12l-2.882 1.664" />
          </svg>
        </div>
        <h1 class="text-xl font-bold">
          Agend<span class="text-primary">Barber</span>
        </h1>
      </div>
      <div className="mt-8 flex-grow space-y-2 pl-2"> {menuItems.map((item, index) => (
        <SidebarItem
          key={index}
          label={item.label}
          route={item.route}
          icon={item.icon}
        />))}
      </div>
      <div className="mt-auto pb-4 px-6">
        <div className="flex items-center">
          <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
        </div>
        <div className="flex items-center ml-4 gap-4 my-4">
          <div className="rounded-full size-10 overflow-hidden">
            <img src="https://thumbs.dreamstime.com/b/s%C3%ADmbolo-de-perfil-masculino-inteligente-retrato-estilo-desenho-animado-m%C3%ADnimo-166146967.jpg" alt="User Avatar" className="size-10" />
          </div>
          <div>
            <div className="text-md font-bold">
              Roberto Viana
            </div>
            <div className="text-[10px] pt-0.5 text-primary">
              MEMBRO VIP
            </div>
          </div>
        </div>
        <button className="w-full py-1.5 bg-transparent border border-solid border-color_text text-color_text font-bold rounded-md transition-colors duration-300 hover:bg-zinc-800 flex items-center justify-center"
          onClick={() => (window.location.href = "http://localhost:8081/login")} >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor" class="size-5 mr-2">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
          </svg>
          Sair
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;

