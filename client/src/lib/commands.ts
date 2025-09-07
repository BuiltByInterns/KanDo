interface Command {
  id: string;
  name: string;
  type: "command";
  action: () => void;
}

export const commands: Command[] = [
  {
    id: "create-board",
    name: "Create board",
    type: "command",
    action: () => {
      console.log("TODO: open create board modal");
    },
  },
  {
    id: "invite-user",
    name: "Invite user",
    type: "command",
    action: () => {
      console.log("TODO: open invite user flow");
    },
  },
];
