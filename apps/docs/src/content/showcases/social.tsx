import { useMemo, useState } from "react";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Dialog,
  Input,
  Label,
  Panel,
  PanelBody,
  PanelHeader,
  PanelTitle,
  Separator,
  Textarea,
  useToast,
} from "@deskui/ui";

import { PageHeader } from "../../components/docs/doc-ui";
import { BrandMark, NoteIcon } from "../../components/icons";
import {
  formatShowcaseCopy,
  useShowcaseCopy,
  type SeedCommentKey,
  type SeedMessageKey,
  type SeedPostKey,
  type SocialContactStatus,
  type SocialCopy,
} from "../../i18n/showcase-copy";

type Comment = {
  id: number;
  seedKey?: SeedCommentKey;
  author: string;
  content: string;
};

type Post = {
  id: number;
  seedKey?: SeedPostKey;
  author: string;
  handle: string;
  time: string;
  content: string;
  likes: number;
  liked?: boolean;
  comments: Comment[];
};

type Message = {
  id: number;
  seedKey?: SeedMessageKey;
  from: string;
  text: string;
};

const INITIAL_POST_META = [
  {
    id: 1,
    seedKey: "storm",
    author: "Ana Retro",
    handle: "@ana95",
    likes: 12,
    comments: [{ id: 1, seedKey: "contrast", author: "Luis" }],
  },
  {
    id: 2,
    seedKey: "floppy",
    author: "Carlos Bit",
    handle: "@carlosbit",
    likes: 8,
    comments: [],
  },
  {
    id: 3,
    seedKey: "wishlist",
    author: "Marta Pixel",
    handle: "@martapixel",
    likes: 21,
    comments: [{ id: 2, seedKey: "printer", author: "Ana Retro" }],
  },
] as const satisfies ReadonlyArray<{
  id: number;
  seedKey: SeedPostKey;
  author: string;
  handle: string;
  likes: number;
  comments: ReadonlyArray<{
    id: number;
    seedKey: SeedCommentKey;
    author: string;
  }>;
}>;

function createInitialPosts(copy: SocialCopy): Post[] {
  return INITIAL_POST_META.map((meta) => ({
    id: meta.id,
    seedKey: meta.seedKey,
    author: meta.author,
    handle: meta.handle,
    time: copy.seedPosts[meta.seedKey].time,
    content: copy.seedPosts[meta.seedKey].content,
    likes: meta.likes,
    comments: meta.comments.map((comment) => ({
      id: comment.id,
      seedKey: comment.seedKey,
      author: comment.author,
      content: copy.seedComments[comment.seedKey],
    })),
  }));
}

function localizePost(post: Post, copy: SocialCopy): Post {
  if (!post.seedKey) {
    return post;
  }
  const seed = copy.seedPosts[post.seedKey];
  return {
    ...post,
    time: seed.time,
    content: seed.content,
    comments: post.comments.map((comment) =>
      comment.seedKey
        ? { ...comment, content: copy.seedComments[comment.seedKey] }
        : comment,
    ),
  };
}

const CONTACTS: ReadonlyArray<{
  name: string;
  status: SocialContactStatus;
}> = [
  { name: "Ana Retro", status: "online" },
  { name: "Luis Módem", status: "away" },
  { name: "Marta Pixel", status: "online" },
  { name: "Carlos Bit", status: "busy" },
];

const INITIAL_MESSAGE_META = [
  { id: 1, seedKey: "storm" },
  { id: 2, seedKey: "reply" },
] as const satisfies ReadonlyArray<{ id: number; seedKey: SeedMessageKey }>;

function createInitialMessages(copy: SocialCopy): Message[] {
  return INITIAL_MESSAGE_META.map(({ id, seedKey }) => ({
    id,
    seedKey,
    ...copy.seedMessages[seedKey],
  }));
}

function localizeMessage(message: Message, copy: SocialCopy): Message {
  if (!message.seedKey) {
    return message;
  }
  return { ...message, ...copy.seedMessages[message.seedKey] };
}

export function SocialShowcase() {
  const copy = useShowcaseCopy("social");
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>(() => createInitialPosts(copy));
  const [draft, setDraft] = useState("");
  const [commentDrafts, setCommentDrafts] = useState<Record<number, string>>({});
  const [openComments, setOpenComments] = useState<Record<number, boolean>>({});
  const [messagesOpen, setMessagesOpen] = useState(false);
  const [messageDraft, setMessageDraft] = useState("");
  const [messages, setMessages] = useState<Message[]>(() =>
    createInitialMessages(copy),
  );

  const localizedPosts = useMemo(
    () => posts.map((post) => localizePost(post, copy)),
    [copy, posts],
  );
  const localizedMessages = useMemo(
    () => messages.map((message) => localizeMessage(message, copy)),
    [copy, messages],
  );

  function publish() {
    const content = draft.trim();
    if (!content) {
      return;
    }

    setPosts((previous) => [
      {
        id: Date.now(),
        author: copy.you,
        handle: copy.handle,
        time: copy.justNow,
        content,
        likes: 0,
        comments: [],
      },
      ...previous,
    ]);
    setDraft("");
    toast({
      title: copy.publishedToastTitle,
      description: copy.publishedToastDescription,
      duration: 0,
    });
  }

  function toggleLike(id: number) {
    setPosts((previous) =>
      previous.map((post) =>
        post.id === id
          ? {
              ...post,
              likes: post.likes + (post.liked ? -1 : 1),
              liked: !post.liked,
            }
          : post,
      ),
    );
  }

  function addComment(id: number) {
    const content = (commentDrafts[id] ?? "").trim();
    if (!content) {
      return;
    }

    setPosts((previous) =>
      previous.map((post) =>
        post.id === id
          ? {
              ...post,
              comments: [
                ...post.comments,
                { id: Date.now(), author: copy.you, content },
              ],
            }
          : post,
      ),
    );
    setCommentDrafts((previous) => ({ ...previous, [id]: "" }));
  }

  function sendMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = messageDraft.trim();
    if (!text) {
      return;
    }
    setMessages((previous) => [
      ...previous,
      { id: Date.now(), from: copy.you, text },
    ]);
    setMessageDraft("");
  }

  return (
    <div>
      <PageHeader
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
      />

      <div className="grid gap-3 lg:grid-cols-[200px_minmax(0,1fr)]">
        <aside className="grid content-start gap-3">
          <h2 className="sr-only">{copy.profileSr}</h2>
          <Card aria-label={copy.profileCardAria}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center bg-desktop text-ink-inverse">
                  <BrandMark />
                </span>
                <div className="min-w-0">
                  <CardTitle>{copy.yourProfile}</CardTitle>
                  <CardDescription>{copy.handle}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-3 gap-1 text-center text-[10px] leading-[12px]">
                <div>
                  <dt className="text-ink-muted">{copy.postsLabel}</dt>
                  <dd className="font-bold">{posts.length}</dd>
                </div>
                <div>
                  <dt className="text-ink-muted">{copy.friends}</dt>
                  <dd className="font-bold">128</dd>
                </div>
                <div>
                  <dt className="text-ink-muted">{copy.following}</dt>
                  <dd className="font-bold">64</dd>
                </div>
              </dl>
            </CardContent>
            <CardFooter>
              <Button
                size="sm"
                onClick={() =>
                  toast({
                    title: copy.profileToastTitle,
                    description: copy.profileToastDescription,
                    duration: 0,
                  })
                }
              >
                {copy.editProfile}
              </Button>
            </CardFooter>
          </Card>

          <Panel aria-label={copy.contactsAria}>
            <PanelHeader>
              <PanelTitle>{copy.contactsTitle}</PanelTitle>
              <Badge variant="success">4</Badge>
            </PanelHeader>
            <PanelBody>
              <ul className="grid gap-1">
                {CONTACTS.map((contact) => (
                  <li
                    key={contact.name}
                    className="flex items-center justify-between gap-2 text-[11px] leading-[15px]"
                  >
                    <span className="flex items-center gap-1">
                      <span
                        aria-hidden="true"
                        className={
                          contact.status === "online"
                            ? "h-2 w-2 bg-success"
                            : contact.status === "busy"
                              ? "h-2 w-2 bg-danger"
                              : "h-2 w-2 bg-warning"
                        }
                      />
                      {contact.name}
                    </span>
                    <span className="text-[10px] text-ink-muted">
                      {copy.statuses[contact.status]}
                    </span>
                  </li>
                ))}
              </ul>
            </PanelBody>
          </Panel>

          <Panel aria-label={copy.notificationsAria}>
            <PanelHeader>
              <PanelTitle>{copy.notificationsTitle}</PanelTitle>
            </PanelHeader>
            <PanelBody>
              <ul className="grid gap-1 text-[11px] leading-[15px]">
                {copy.notifications.map((notification) => (
                  <li key={notification}>{notification}</li>
                ))}
              </ul>
            </PanelBody>
          </Panel>

          <Panel aria-label={copy.messagesAria}>
            <PanelHeader>
              <PanelTitle>{copy.messagesTitle}</PanelTitle>
              <Badge variant="info">{messages.length}</Badge>
            </PanelHeader>
            <PanelBody>
              <p className="text-[11px] leading-[15px]">
                <strong>
                  {localizedMessages[localizedMessages.length - 1]?.from}:
                </strong>{" "}
                {localizedMessages[localizedMessages.length - 1]?.text}
              </p>
              <Button
                size="sm"
                className="mt-2"
                onClick={() => setMessagesOpen(true)}
              >
                {copy.openMessaging}
              </Button>
            </PanelBody>
          </Panel>
        </aside>

        <div className="grid content-start gap-3">
          <Panel aria-label={copy.newPostAria}>
            <PanelHeader>
              <PanelTitle>{copy.newPostTitle}</PanelTitle>
            </PanelHeader>
            <PanelBody>
              <Label htmlFor="social-draft" className="sr-only">
                {copy.draftLabel}
              </Label>
              <Textarea
                id="social-draft"
                rows={3}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder={copy.draftPlaceholder}
              />
              <div className="mt-2 flex items-center justify-between gap-2">
                <span className="text-[10px] leading-[12px] text-ink-muted">
                  {formatShowcaseCopy(copy.characterCount, {
                    count: draft.length,
                  })}
                </span>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={publish}
                  disabled={draft.trim().length === 0}
                >
                  {copy.publish}
                </Button>
              </div>
            </PanelBody>
          </Panel>

          {localizedPosts.map((post) => (
            <Card
              key={post.id}
              aria-label={formatShowcaseCopy(copy.postAria, {
                author: post.author,
              })}
            >
              <CardHeader>
                <div className="flex items-center gap-2">
                  <span className="grid h-7 w-7 place-items-center bg-surface-pressed">
                    <NoteIcon />
                  </span>
                  <div className="min-w-0">
                    <CardTitle>{post.author}</CardTitle>
                    <CardDescription>
                      {post.handle} · {post.time}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-[12px] leading-[16px]">{post.content}</p>
              </CardContent>
              <CardFooter className="justify-start">
                <Button
                  size="sm"
                  aria-pressed={post.liked}
                  onClick={() => toggleLike(post.id)}
                >
                  {formatShowcaseCopy(copy.like, { count: post.likes })}
                </Button>
                <Button
                  size="sm"
                  onClick={() =>
                    setOpenComments((previous) => ({
                      ...previous,
                      [post.id]: !previous[post.id],
                    }))
                  }
                >
                  {formatShowcaseCopy(copy.comments, {
                    count: post.comments.length,
                  })}
                </Button>
              </CardFooter>

              {openComments[post.id] ? (
                <div className="mt-2 border-t border-bevel-light pt-2">
                  {post.comments.length > 0 ? (
                    <ul className="grid gap-1">
                      {post.comments.map((comment) => (
                        <li
                          key={comment.id}
                          className="text-[11px] leading-[15px]"
                        >
                          <strong>{comment.author}:</strong> {comment.content}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-[11px] leading-[15px] text-ink-muted">
                      {copy.noComments}
                    </p>
                  )}
                  <Separator className="my-2" />
                  <div className="flex gap-2">
                    <Label htmlFor={`comment-${post.id}`} className="sr-only">
                      {copy.commentLabel}
                    </Label>
                    <Input
                      id={`comment-${post.id}`}
                      value={commentDrafts[post.id] ?? ""}
                      onChange={(event) =>
                        setCommentDrafts((previous) => ({
                          ...previous,
                          [post.id]: event.target.value,
                        }))
                      }
                      placeholder={copy.commentPlaceholder}
                    />
                    <Button size="sm" onClick={() => addComment(post.id)}>
                      {copy.send}
                    </Button>
                  </div>
                </div>
              ) : null}
            </Card>
          ))}
        </div>
      </div>

      <Dialog
        open={messagesOpen}
        onOpenChange={setMessagesOpen}
        title={copy.messagingTitle}
        icon={<NoteIcon />}
        footer={
          <Button size="sm" onClick={() => setMessagesOpen(false)}>
            {copy.close}
          </Button>
        }
      >
        <div className="grid gap-2">
          <p className="text-[11px] leading-[15px] text-ink-muted">
            {copy.conversationWith}
          </p>
          <ul
            aria-label={copy.conversationAria}
            className="bevel-field grid max-h-48 gap-1 overflow-y-auto bg-surface-sunken p-2"
          >
            {localizedMessages.map((message) => (
              <li key={message.id} className="text-[11px] leading-[15px]">
                <strong>{message.from}:</strong> {message.text}
              </li>
            ))}
          </ul>
          <form onSubmit={sendMessage} className="flex gap-2">
            <Label htmlFor="social-message" className="sr-only">
              {copy.messageLabel}
            </Label>
            <Input
              id="social-message"
              value={messageDraft}
              onChange={(event) => setMessageDraft(event.target.value)}
              placeholder={copy.messagePlaceholder}
            />
            <Button type="submit" size="sm">
              {copy.send}
            </Button>
          </form>
        </div>
      </Dialog>
    </div>
  );
}
