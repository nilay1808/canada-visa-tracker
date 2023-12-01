async function main() {
  console.log("Cron job started");

  // wait for 20 seconds
  await new Promise((resolve) => setTimeout(resolve, 20000));

  console.log("Cron job finished");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
