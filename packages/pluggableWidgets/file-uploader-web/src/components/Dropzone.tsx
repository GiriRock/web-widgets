import { observer } from "mobx-react-lite";
import classNames from "classnames";
import { Fragment, ReactElement } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { MimeCheckFormat } from "../utils/parseAllowedFormats";
import { TranslationsStore } from "../stores/TranslationsStore";
import { useTranslationsStore } from "../utils/useTranslationsStore";

interface DropzoneProps {
    warningMessage?: string;
    onDrop: (files: File[], fileRejections: FileRejection[]) => void;
    maxSize: number;
    maxFilesPerUpload: number;
    acceptFileTypes: MimeCheckFormat;
    disabled: boolean;
}

export const Dropzone = observer(
    ({
        warningMessage,
        onDrop,
        maxSize,
        maxFilesPerUpload,
        acceptFileTypes,
        disabled
    }: DropzoneProps): ReactElement => {
        const { getRootProps, getInputProps, isDragAccept, isDragReject } = useDropzone({
            onDrop,
            maxSize: maxSize || undefined,
            maxFiles: maxFilesPerUpload,
            accept: acceptFileTypes,
            disabled
        });

        const translations = useTranslationsStore();
        const [type, msg] = getMessage(translations, isDragAccept, isDragReject);

        const fileExtensions = Object.values(acceptFileTypes)
            .flat()
            .map(ext => ext.replace(".", "").toUpperCase())
            .join(", ");

        const maxSizeMiB = Math.floor(maxSize / (1024 * 1024));
        const maxSizeLabel = maxSizeMiB > 0 ? translations.get("maxFileSizeLabelMessage", maxSizeMiB.toString()) : null;
        const subtitle = [fileExtensions, maxSizeLabel].filter(Boolean).join(" ");

        return (
            <Fragment>
                <div
                    className={classNames("dropzone", {
                        active: type === "active",
                        disabled,
                        warning: !!warningMessage || type === "warning"
                    })}
                    {...getRootProps()}
                >
                    <div className={"upload-circle-icon"}>
                        <span>+</span>
                    </div>
                    <div className={"upload-text-container"} dir="auto">
                        {!disabled && (
                            <p className={"upload-text"}>
                                <span>{msg}</span>
                                {type === "idle" && (
                                    <span className={"upload-browse"}>
                                        {" "}
                                        {translations.get("dropzoneBrowseMessage")}
                                    </span>
                                )}
                            </p>
                        )}
                        {subtitle && <p className={"upload-subtitle"}>{subtitle}</p>}
                    </div>
                    {!disabled && <input {...getInputProps()} />}
                </div>
                {warningMessage && <div className={classNames("dropzone-message")}>{warningMessage}</div>}
            </Fragment>
        );
    }
);

type MessageType = "active" | "warning" | "idle";

function getMessage(
    translations: TranslationsStore,
    isDragAccept: boolean,
    isDragReject: boolean
): [MessageType, string] {
    if (isDragAccept) {
        return ["active", translations.get("dropzoneAcceptedMessage")];
    }
    if (isDragReject) {
        return ["warning", translations.get("dropzoneRejectedMessage")];
    }

    return ["idle", translations.get("dropzoneIdleMessage")];
}
