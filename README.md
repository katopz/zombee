# zombee
🐝 Zombee will keep interval fetch target uri until it die

## TODO - Feature
- [ ] Accept uri as array
- [x] Emit event
- [ ] Optional log
- [ ] External dashboard

## TODO - Test
### Log
- [x] Expect new YYYY-MM-DD log file use each day.
- [x] Expect new YYYY-MM-DD log file use each month.
- [x] Expect new YYYY-MM-DD log file use each year.
- [x] Expect new log folder create if not exist with minimal permission.
- [ ] Expect error if not allowed path used.
- [ ] Expect error if not allowed name used.
- [x] Expect info print to file.
- [x] Expect warn print to file.
- [x] Expect error print to file.

### Fetch
- [x] Expect fetch done as interval set.
- [x] Expect fetch response to be same URI.

### Features v1.0.0
- [ ] Add browser log support.
- [ ] Add browser log persistance support.
- [ ] Add browser unit test.

### Finalize
- [ ] Remove unused module.
- [ ] Fresh install test.
- [x] Add linter.
- [ ] Add distribute.
- [ ] Distribute npm.