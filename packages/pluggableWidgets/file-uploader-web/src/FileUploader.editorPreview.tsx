import { ReactElement } from "react";
import { FileUploaderPreviewProps } from "../typings/FileUploaderProps";
import classNames from "classnames";

export function preview(props: FileUploaderPreviewProps): ReactElement {
    return (
        <div className={classNames(props.class, "widget-file-uploader")}>
            <div className={classNames("dropzone")}>
                <div className={"upload-circle-icon"}>
                    <span>+</span>
                </div>
                <div className={"upload-text-container"}>
                    <p className={"upload-text"}>
                        <span>{props.dropzoneIdleMessage}</span>
                        <span className={"upload-browse"}> {props.dropzoneBrowseMessage}</span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export function getPreviewCss(): string {
    return "";
}
