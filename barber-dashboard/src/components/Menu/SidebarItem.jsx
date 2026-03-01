import { NavLink } from "react-router-dom";

const SidebarItem = ({ label, route, icon: Icon }) => {
    return (
        <NavLink to={route} end className={({ isActive }) => [
            "no-underline flex items-center p-4 gap-4 cursor-pointer transition-all duration-300 rounded-lg",
            isActive ? "text-primary bg-gradient-to-r from-[rgba(255,186,0,0.3)] via-[rgba(255,186,0,0.1)] to-transparent shadow-inset-gradient"
                : "text-color_text hover:bg-gray-800",].join(" ")} >
            {({ isActive }) => (<>
                <Icon className={["size-6", isActive ? "text-primary" : "text-color_text"].join(" ")} />
                <span className={["text-base font-medium", isActive ? "text-primary" : "text-color_text"]}>{label}</span> </>
            )}
        </NavLink>
    );
};

export default SidebarItem;