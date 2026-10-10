import { useState } from 'react';
import { KeyboardAvoidingView, Modal, TextInput, View } from 'react-native';

import { Button, T, TextBtn } from '@/components/ui';
import { checkPin } from '@/lib/pin';

// Asked right before this phone's key signs something that others will trust. Cancel means nothing is signed.
export function PinPrompt({ title, visible, onCancel, onOk }: { title: string; visible: boolean; onCancel: () => void; onOk: () => void }) {
  const [pin, setPin] = useState('');
  const [why, setWhy] = useState('');
  const close = () => {
    setPin('');
    setWhy('');
    onCancel();
  };
  const submit = () => {
    const r = checkPin(pin);
    setPin('');
    if (r.ok) {
      setWhy('');
      onOk();
    } else setWhy(r.why);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={close}>
      <KeyboardAvoidingView behavior="padding" className="flex-1 justify-end bg-black/40">
        <View className="rounded-t-sheet bg-paper px-5 pb-8 pt-6">
          <T w="bold" className="text-[22px] tracking-[-0.4px]">
            {title}
          </T>
          <T className="mt-1 text-[15px] text-ink-2">Enter your PIN</T>
          <View className="mt-4 h-14 justify-center rounded-xl bg-tile px-4">
            <TextInput
              value={pin}
              onChangeText={(t) => setPin(t.replace(/\D/g, '').slice(0, 6))}
              onSubmitEditing={submit}
              secureTextEntry
              keyboardType="number-pad"
              autoFocus
              placeholder="••••"
              placeholderTextColor="#BDBDBD"
              className="font-semibold text-[24px] tracking-[6px] text-ink"
            />
          </View>
          {why ? <T className="mt-2 text-[14px] text-fail">{why}</T> : null}
          <View className="mt-4">
            <Button label="Confirm" disabled={pin.length < 4} onPress={submit} />
            <TextBtn label="Cancel" onPress={close} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
