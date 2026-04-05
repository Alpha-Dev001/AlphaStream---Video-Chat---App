import { Link } from "react-router";
import { LANGUAGE_TO_FLAG } from "../constants";

function getLanguageFlag(language) {
    if (!language) return null;
    const countryCode = LANGUAGE_TO_FLAG[language.toLowerCase()];
    if (!countryCode) return null;

    return (
        <img
            src={`https://flagcdn.com/24x18/${countryCode}.png`}
            alt={`${language} flag`}
            className="h-3 mr-1 inline-block"
        />
    );
}

const UserCard = ({
    user,
    actionLabel,
    actionIcon: ActionIcon,
    onAction,
    actionDisabled,
    actionType = "button",
    linkTo,
    badgeLabel,
}) => {
    return (
        <div className="card bg-base-200 hover:shadow-lg transition-shadow duration-300">
            <div className="card-body p-5 space-y-4">
                <div className="flex items-center gap-3">
                    <div className="avatar size-16 rounded-full bg-base-300 overflow-hidden">
                        <img
                            src={user.profilePic || "/default-avatar.svg"}
                            alt={user.fullName}
                            onError={(e) => {
                                e.target.src = "/default-avatar.svg";
                            }}
                        />
                    </div>
                    <div className="min-w-0">
                        <h3 className="font-semibold text-lg truncate">{user.fullName}</h3>
                        {user.location && (
                            <div className="flex items-center text-xs opacity-70 mt-1 truncate">
                                <span className="mr-1">📍</span>
                                <span>{user.location}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                    <span className="badge badge-secondary text-xs">
                        {getLanguageFlag(user.nativeLanguage)} Native: {user.nativeLanguage}
                    </span>
                    <span className="badge badge-outline text-xs">
                        {getLanguageFlag(user.learningLanguage)} Learning: {user.learningLanguage}
                    </span>
                </div>

                {user.bio && <p className="text-sm opacity-70 line-clamp-3">{user.bio}</p>}

                <div className="flex flex-col gap-2">
                    {linkTo ? (
                        <Link to={linkTo} className="btn btn-outline w-full">
                            {badgeLabel || "Message"}
                        </Link>
                    ) : null}

                    {onAction ? (
                        <button
                            type={actionType}
                            className={`btn w-full ${actionDisabled ? "btn-disabled" : "btn-primary"}`}
                            onClick={onAction}
                            disabled={actionDisabled}
                        >
                            {ActionIcon ? <ActionIcon className="size-4 mr-2" /> : null}
                            {actionLabel}
                        </button>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default UserCard;
