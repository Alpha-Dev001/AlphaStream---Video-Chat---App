import { Link } from "react-router";

const AuthPageLayout = ({
    title,
    description,
    children,
    footerText,
    footerLinkText,
    footerLinkTo,
    asideTitle,
    asideText,
    illustrationSrc = "/i.png",
    theme = "night",
}) => {
    return (
        <div className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 bg-base-100" data-theme={theme}>
            <div className="border border-primary/20 flex flex-col lg:flex-row w-full max-w-6xl mx-auto bg-base-100 rounded-3xl shadow-xl overflow-hidden">
                <div className="w-full lg:w-1/2 p-6 sm:p-10 flex flex-col justify-between">
                    <div>
                        <div className="mb-6 flex items-center gap-3">
                            <img src="/logo.svg" alt="AlphaStream logo" className="w-12 h-12 rounded-2xl" />
                            <span className="text-3xl font-bold tracking-wide">AlphaStream</span>
                        </div>

                        <div className="space-y-3 mb-8">
                            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">{title}</h1>
                            <p className="text-base-content/70">{description}</p>
                        </div>

                        <div>{children}</div>
                    </div>

                    <div className="mt-8 text-sm text-base-content/70">
                        {footerText} <Link to={footerLinkTo} className="text-primary hover:underline">{footerLinkText}</Link>
                    </div>
                </div>

                <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center p-8">
                    <div className="max-w-md text-center">
                        <div className="relative aspect-square max-w-sm mx-auto">
                            <img src={illustrationSrc} alt="Illustration" className="w-full h-full object-cover" />
                        </div>
                        <div className="mt-6 space-y-3">
                            <h2 className="text-xl font-semibold">{asideTitle}</h2>
                            <p className="opacity-70">{asideText}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPageLayout;
