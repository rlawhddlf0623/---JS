let validCollectionName = 0;
// 회원정보 저장 + 사용자id로 todo collection만들기 : app.post("/UserCollection",
exports.UserCollection = async (req, res) => {
  const { id, pw, email, name } = req.body;
  console.log(id, pw, email, name);
  if (!id || !pw || !email || !name) {
    return res
      .status(400)
      .json({ error: "Collection name and todo are required" });
  }

  try {
    // 사용자 입력 이메일과 동일한 이메일을 가진 문서를 찾습니다.
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      console.log("Email already exists");
      return res.status(400).json({ error: "Email already exists" });
    } else {
      console.log("사용할 수 있는 이메일입니다.");
      //users에 저장
      const newUser = new User({ id, pw, email, name });
      await newUser.save();

      validCollectionName = id.replace(/[^a-zA-Z0-9]/g, "");
      // console.log("validCollectionName(회원가입): ", validCollectionName);
      // 사용자id로 collection만들기( collection 만들때 document 1개는 필수로 생성 )
      // const TodoModel = CreateCollection(validCollectionName);
      // await new TodoModel({
      //   id: id,
      //   todo: "first create todo",
      //   status: "pending",
      // }).save();

      return res.status(201).json({ message: "User created successfully" });
    }
  } catch (err) {
    console.error("데이터베이스에서 사용자 검색 중 오류:", err);
    return res.status(500).json({ error: "Database error" });
  }
};
