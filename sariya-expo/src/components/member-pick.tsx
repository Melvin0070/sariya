import { TextInput, View } from "react-native";

import { C, Illo, Overline, Press, T, Tile } from "@/components/ui";
import { pourPresets } from "@/lib/pour";
import { isSoon, KIND_LABEL, type MemberKind } from "@/lib/spec";

export const KINDS: MemberKind[] = ["slab", "beam", "column"];
const EXAMPLE: Record<MemberKind, string> = {
  slab: "Slab S1, first floor",
  beam: "Beam B2, grid C",
  column: "Column C3, ground floor",
};

// Kind is usually preselected, so the tiles stay compact and the name field carries the screen.
export function MemberPick({
  kind,
  onKind,
  name,
  onName,
  onSubmit,
  fixed,
  site,
  onSite,
  pourAt,
  onPour,
}: {
  kind: MemberKind;
  onKind: (k: MemberKind) => void;
  name: string;
  onName: (s: string) => void;
  onSubmit: () => void;
  fixed?: boolean; // kind already chosen (Home tile): don't ask again
  site?: string;
  onSite?: (s: string) => void;
  pourAt?: number;
  onPour?: (t: number | undefined) => void;
}) {
  return (
    <>
      {fixed ? null : (
        <View className="mt-6 flex-row flex-wrap gap-3">
          {KINDS.map((k) => {
            const soon = isSoon(k);
            return (
              <Tile
                key={k}
                on={kind === k}
                onPress={soon ? undefined : () => onKind(k)}
                className="min-w-[45%] flex-1 flex-row items-center gap-2 py-2 pl-2 pr-3"
              >
                <View style={{ opacity: soon ? 0.45 : 1 }}>
                  <Illo name={k} size={60} />
                </View>
                <View className="flex-1">
                  <T
                    w="bold"
                    className={`text-[17px] ${soon ? "text-ink-3" : ""}`}
                  >
                    {KIND_LABEL[k]}
                  </T>
                  {soon ? (
                    <T className="text-[13px] text-ink-3">Coming soon</T>
                  ) : null}
                </View>
              </Tile>
            );
          })}
        </View>
      )}

      <Overline className={fixed ? "mt-6" : "mt-8"}>
        Member and zone, as on the drawing
      </Overline>
      <View className="mt-2 h-16 justify-center rounded-2xl border-2 border-ink bg-paper px-4">
        <TextInput
          value={name}
          onChangeText={onName}
          placeholder={EXAMPLE[kind]}
          placeholderTextColor={C.ink4}
          autoFocus
          returnKeyType="next"
          onSubmitEditing={onSubmit}
          accessibilityLabel="Member and zone"
          className="font-semibold text-[22px] text-ink"
        />
      </View>
      {onSite ? <SiteAndPour site={site ?? ""} onSite={onSite} pourAt={pourAt} onPour={onPour} /> : null}
    </>
  );
}

// Site and planned pour put this check in the engineer's pour inbox, next to the other sites they cover.
function SiteAndPour({
  site,
  onSite,
  pourAt,
  onPour,
}: {
  site: string;
  onSite: (s: string) => void;
  pourAt?: number;
  onPour?: (t: number | undefined) => void;
}) {
  const presets = pourPresets();
  return (
    <>
      <Overline className="mt-6">Site</Overline>
      <View className="mt-2 h-14 justify-center rounded-2xl bg-tile px-4">
        <TextInput
          value={site}
          onChangeText={onSite}
          placeholder="Sharma house, HSR Layout"
          placeholderTextColor={C.ink4}
          returnKeyType="done"
          accessibilityLabel="Site"
          className="font-medium text-[18px] text-ink"
        />
      </View>
      {onPour ? (
        <>
          <Overline className="mt-6">Planned pour</Overline>
          <View className="mt-2 flex-row flex-wrap gap-2">
            {presets.map((p) => {
              const on = pourAt === p.at;
              return (
                <Press
                  key={p.key}
                  onPress={() => onPour(on ? undefined : p.at)}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: on }}
                  className={`h-12 justify-center rounded-full px-4 ${on ? "bg-ink" : "bg-tile"}`}
                >
                  <T w="semibold" className={`text-[15px] ${on ? "text-white" : ""}`}>
                    {p.label}
                  </T>
                </Press>
              );
            })}
          </View>
        </>
      ) : null}
    </>
  );
}
