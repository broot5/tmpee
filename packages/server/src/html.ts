export function emailListHTMLGenerator(array: { id: number; date: string; senderAddress: string; subject: string }[]) {
  if (array.length == 0) {
    return `<article class="medium middle-align center-align">
      <div>
        <i class="extra">mail</i>
        <h5>You have no new messages</h5>
      </div>
    </article>`;
  }
  const list = array
    .reverse()
    .map(
      (email) => `<a hx-get="/email/${email.id.toString()}" hx-trigger="click" hx-target="#dialog" class="row padding wave">
        <button class="circle">A</button>
        <div class="max">
          <h6 class="small">${email.subject}</h6>
          <div>${email.senderAddress}</div>
        </div>
        <label>+${Math.round((new Date().valueOf() - Date.parse(email.date).valueOf()) / (1000 * 60)).toString()} min</label>
      </a>`
    )
    .join(`<div class="divider"></div>`);

  return "<article>" + list + "</article>";
}

export function emailDialogHTMLGenerator(email: {
  id: number;
  date: string;
  senderName: string;
  senderAddress: string;
  recipientName: string;
  recipientAddress: string;
  subject: string;
  contentHtml: string;
}) {
  return `<dialog class="active medium">
      <h5>${email.subject}</h5>
      <p>${email.senderName}(${email.senderAddress})</p>
      ${email.contentHtml}
      <nav class="right-align bottom">
        <button hx-trigger="click" hx-get="data:text/html," hx-target="#dialog">
          <i>close</i>
          <span>Close</span>
        </button>
      </nav>
    </dialog>`;
}
