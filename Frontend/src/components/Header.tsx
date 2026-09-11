import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/react';

export default function Header() {
  return (
    <header className="w-full p-4 bg-white border-b border-gray-200 flex items-center justify-end space-x-4">
      <Show when="signed-in">
        <UserButton afterSignOutUrl="/"/>
      </Show>
    </header>
  );
}
