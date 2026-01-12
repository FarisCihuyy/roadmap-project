function formatDateTime(
  isoString,
  { locale = "id-ID", timeZone = "UTC", withTime = true } = {}
) {
  const date = new Date(isoString);

  const options = {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone,
  };

  if (withTime) {
    Object.assign(options, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  }

  return new Intl.DateTimeFormat(locale, options)
    .format(date)
    .replace(",", " -");
}

const fetchData = async (username) => {
  const response = await fetch(
    `https://api.github.com/users/${username}/events`,
    {
      headers: {
        Accept: "application/vnd.github+json",
      },
    }
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("User not found");
    } else {
      throw new Error("Something went wrong");
    }
  }

  return response.json();
};

const displayActifity = (activities) => {
  if (activities.length === 0) {
    console.log("No activity found");
    return;
  }

  activities.forEach((actifity) => {
    let action;

    const { type, repo, payload, created_at } = actifity;

    if (type === "PushEvent") {
      action = `${formatDateTime(created_at)} | Pushed to ${repo.name}`;
    } else if (type === "IssuesEvent") {
      action = `${formatDateTime(created_at)} | opened issue ${repo.name}`;
    } else if (type === "WatchEvent") {
      action = `${formatDateTime(created_at)} | starred ${repo.name}`;
    } else if (type === "ForkEvent") {
      action = `${formatDateTime(created_at)} | forked ${repo.name}`;
    } else if (type === "ForkEvent") {
      action = `${formatDateTime(created_at)} | forked ${repo.name}`;
    } else if (type === "CreateEvent") {
      action = `${formatDateTime(created_at)} | created ${
        payload.ref_type
      } in ${repo.name}`;
    } else {
      action = `${formatDateTime(created_at)} | ${type}`;
    }

    console.log(action);
  });
};

const username = process.argv[2];

if (!username) {
  console.log("Please provide a username");
  process.exit(1);
}

fetchData(username)
  .then((activities) => displayActifity(activities))
  .catch((err) => {
    console.log(err.message);
    process.exit(1);
  });
