import {
	LyricSizePreset,
	lyricSizePresetAtom,
} from "@applemusic-like-lyrics/react-full";
import { useAtomValue } from "jotai";
import { type FC, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
	BottomLyricDisplayMode,
	bottomLyricDisplayModeAtom,
	currentLyricAuthorsAtom,
	currentSongWritersAtom,
} from "../../states/appAtoms";
import styles from "./index.module.css";

function getBottomInfoFontSize(preset: LyricSizePreset): string {
	switch (preset) {
		case LyricSizePreset.Tiny:
			return "max(max(1.5vh, 0.75vw), 10px)";
		case LyricSizePreset.ExtraSmall:
			return "max(max(1.8vh, 0.9vw), 10px)";
		case LyricSizePreset.Small:
			return "max(max(2.4vh, 1.2vw), 10px)";
		case LyricSizePreset.Large:
			return "max(max(3.6vh, 1.8vw), 12px)";
		case LyricSizePreset.ExtraLarge:
			return "max(max(4.2vh, 2.1vw), 14px)";
		case LyricSizePreset.Huge:
			return "max(max(4.8vh, 2.4vw), 16px)";
		default:
			return "max(max(3vh, 1.5vw), 10px)";
	}
}

export const BottomLyricInfo: FC = () => {
	const { t } = useTranslation();
	const mode = useAtomValue(bottomLyricDisplayModeAtom);
	const lyricAuthors = useAtomValue(currentLyricAuthorsAtom);
	const songWriters = useAtomValue(currentSongWritersAtom);
	const lyricSizePreset = useAtomValue(lyricSizePresetAtom);

	const displayContent = useMemo(() => {
		if (mode === BottomLyricDisplayMode.None) {
			return null;
		}

		const lyricsStr = lyricAuthors.join(", ");
		const writersStr = songWriters.join(", ");

		const hasLyrics = lyricAuthors.length > 0;
		const hasWriters = songWriters.length > 0;

		const renderLyrics = () => (
			<>
				<strong>{t("bottom_lyric.lyricAuthor", "歌词作者：")}</strong>
				{lyricsStr}
			</>
		);

		const renderWriters = () => (
			<>
				<strong>{t("bottom_lyric.songWriter", "创作者：")}</strong>
				{writersStr}
			</>
		);

		switch (mode) {
			case BottomLyricDisplayMode.OnlyLyricAuthors:
				return hasLyrics ? renderLyrics() : null;

			case BottomLyricDisplayMode.OnlySongWriters:
				return hasWriters ? renderWriters() : null;

			case BottomLyricDisplayMode.PreferLyricAuthors:
				if (hasLyrics) return renderLyrics();
				if (hasWriters) return renderWriters();
				return null;

			case BottomLyricDisplayMode.PreferSongWriters:
				if (hasWriters) return renderWriters();
				if (hasLyrics) return renderLyrics();
				return null;

			default:
				return null;
		}
	}, [mode, lyricAuthors, songWriters, t]);

	if (!displayContent) return null;

	return (
		<div
			className={styles.bottomInfo}
			style={{
				fontSize: getBottomInfoFontSize(lyricSizePreset),
			}}
		>
			{displayContent}
		</div>
	);
};
