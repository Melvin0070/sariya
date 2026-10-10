import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View } from "react-native";

import { KINDS, MemberPick } from "@/components/member-pick";
import { Button, Illo, Screen, Title, TopBar } from "@/components/ui";
import { isSoon, KIND_LABEL, type MemberKind } from "@/lib/spec";
import { actions, getState } from "@/lib/store";

// Home picks slab or beam, so this screen is usually just the name.
export default function NewInspection() {
  const p = useLocalSearchParams<{ kind?: MemberKind }>();
  const [kind, setKind] = useState<MemberKind>(
    p.kind && KINDS.includes(p.kind) && !isSoon(p.kind) ? p.kind : "slab",
  );
  const [name, setName] = useState("");
  // Most checks on a phone are for the site it was last used on.
  const [site, setSite] = useState(
    () => getState().records.find((r) => r.origin === "local" && r.site)?.site ?? "",
  );
  const [pourAt, setPourAt] = useState<number | undefined>();
  const ready = name.trim().length > 0;
  const fixed = !!p.kind && p.kind === kind;
  const go = () => {
    if (!ready) return;
    actions.newInspection(kind, name.trim(), null, { site, pourAt });
    router.replace("/inspect/spec");
  };

  return (
    <Screen
      footer={
        <Button label="Next: drawing values" disabled={!ready} onPress={go} />
      }
    >
      <TopBar />
      <View className="flex-row items-center">
        <Title className="flex-1">
          {fixed
            ? `New ${KIND_LABEL[kind].toLowerCase()} check`
            : "New inspection"}
        </Title>
        {fixed ? <Illo name={kind} size={84} /> : null}
      </View>
      <MemberPick
        kind={kind}
        onKind={setKind}
        name={name}
        onName={setName}
        onSubmit={go}
        fixed={fixed}
        site={site}
        onSite={setSite}
        pourAt={pourAt}
        onPour={setPourAt}
      />
    </Screen>
  );
}
