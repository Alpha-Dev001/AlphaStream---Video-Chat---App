import { Link, useLocation } from "react-router";
import { BellIcon, HomeIcon, UsersIcon } from "lucide-react";

const BottomNav = () => {
    const location = useLocation();
    const currentPath = location.pathname;

    const navItems = [
        { label: "Home", to: "/", icon: HomeIcon },
        { label: "Friends", to: "/friends", icon: UsersIcon },
        { label: "Notifications", to: "/notifications", icon: BellIcon },
    ];

    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-base-300 bg-base-100/95 backdrop-blur-md">
            <nav className="container mx-auto flex items-center justify-between px-4 py-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = currentPath === item.to;
                    return (
                        <Link
                            key={item.to}
                            to={item.to}
                            className={`flex-1 rounded-2xl px-3 py-2 text-center transition-colors ${active ? "bg-primary text-white" : "text-base-content/70 hover:bg-base-200"
                                }`}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <Icon className="size-5" />
                                <span className="text-xs">{item.label}</span>
                            </div>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
};

export default BottomNav;
